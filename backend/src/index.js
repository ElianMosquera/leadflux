import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import agentsRouter from './routes/agents.js'
import leadsRouter from './routes/leads.js'
import adminRouter from './routes/admin.js'
import settingsRouter from './routes/settings.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'LeadFlux API' }))

// Routes
app.use('/api/agents', agentsRouter)
app.use('/api/leads', leadsRouter)
app.use('/api/admin', adminRouter)
app.use('/api/settings', settingsRouter)


// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 LeadFlux API running on http://localhost:${PORT}`)
})
