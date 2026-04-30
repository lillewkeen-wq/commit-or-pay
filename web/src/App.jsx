import React from "react";
import { useEffect, useState } from 'react'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const tg = window.Telegram.WebApp
    tg.expand()

    const u = tg.initDataUnsafe.user

    fetch('/me', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({user:u})
    })
    .then(r=>r.json())
    .then(setUser)
  },[])

  const createDuel = async () => {
    const text = prompt('Задача')
    const amount = prompt('Сумма')

    await fetch('/duel', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        userId:user.telegram_id,
        text,
        amount
      })
    })

    alert('Создано')
  }

  return (
    <div style={{padding:20}}>
      <h1>Commit or Pay 🔥</h1>

      {user && (
        <>
          <p>Баланс: {user.balance}</p>
          <button onClick={createDuel}>Создать дуэль</button>
        </>
      )}
    </div>
  )
}

export default App
