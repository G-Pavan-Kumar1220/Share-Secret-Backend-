require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./DataBase/DB')
const pasteRoutes = require('./route/pasteRoute')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.json())

// HEALTH CHECK
app.get('/api/healthz', async (req, res) => {
  try {

    res.json({ ok: true })
  } catch {
    res.status(500).json({ ok: false })
  }
})

app.use('/api/pastes', pasteRoutes)

connectDB()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on ${PORT}`))
