require('dotenv').config()
const express = require('express')
const pool = require('../db')
const app = express()

app.use(express.json())

// USER
app.post('/me', async (req, res) => {
  const { id, username } = req.body.user
  let user = await pool.query('SELECT * FROM users WHERE telegram_id=$1',[id])

  if (!user.rows.length) {
    await pool.query('INSERT INTO users (telegram_id, username) VALUES ($1,$2)',[id, username])
    user = await pool.query('SELECT * FROM users WHERE telegram_id=$1',[id])
  }

  res.json(user.rows[0])
})

// CREATE DUEL
app.post('/duel', async (req, res) => {
  const { userId, text, amount } = req.body

  if (!text || !amount) return res.status(400).json({error:'invalid'})

  const duel = await pool.query(
    `INSERT INTO duels (creator_id,text,amount)
     VALUES ($1,$2,$3) RETURNING *`,
    [userId, text, amount]
  )

  res.json(duel.rows[0])
})

// ACCEPT DUEL
app.post('/duel/accept', async (req, res) => {
  const { duelId, userId } = req.body

  const duel = await pool.query('SELECT * FROM duels WHERE id=$1',[duelId])
  const d = duel.rows[0]

  if (!d) return res.status(404).json({error:'not found'})
  if (d.creator_id === userId) return res.status(400).json({error:'self-accept'})

  await pool.query(
    'UPDATE duels SET opponent_id=$1,status=$2 WHERE id=$3',
    [userId,'active',duelId]
  )

  res.json({ok:true})
})

// PROOF
app.post('/proof', async (req, res) => {
  const { duelId, userId, file } = req.body

  if (!file) return res.status(400).json({error:'no proof'})

  await pool.query(
    `INSERT INTO proofs (duel_id,user_id,file_url)
     VALUES ($1,$2,$3)`,
    [duelId,userId,file]
  )

  res.json({ok:true})
})

// FINISH
app.post('/duel/finish', async (req, res) => {
  const { duelId, winnerId } = req.body

  const duel = await pool.query('SELECT * FROM duels WHERE id=$1',[duelId])
  const d = duel.rows[0]

  if (!d) return res.status(404).json({error:'not found'})
  if (winnerId === d.creator_id) return res.status(400).json({error:'cheat'})

  const total = d.amount * 2
  const fee = Math.floor(total * 0.1)

  await pool.query(
    'UPDATE users SET balance = balance + $1 WHERE telegram_id=$2',
    [total - fee, winnerId]
  )

  await pool.query(
    'UPDATE duels SET status=$1,winner_id=$2 WHERE id=$3',
    ['finished', winnerId, duelId]
  )

  res.json({ok:true})
})

app.listen(3001, () => console.log('API running 🚀'))
