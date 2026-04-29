require('dotenv').config()
const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => {
  ctx.reply('🔥 Commit or Pay', {
    reply_markup: {
      inline_keyboard: [[{ text: '🚀 Открыть App', web_app: { url: process.env.WEBAPP_URL } }]]
    }
  })
})

bot.launch()
