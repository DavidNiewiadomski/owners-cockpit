import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import cron from 'node-cron'
import dotenv from 'dotenv'
import { logger } from './utils/logger.js'
import { validateEnv } from './utils/validation.js'
import { levelingRoutes } from './routes/leveling.js'
import { cronJobs } from './jobs/cron.js'

// Load environment variables
dotenv.config()

// Validate environment
validateEnv()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}))

// Compression middleware
app.use(compression())

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`)
  })
  next()
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'leveling-engine',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  })
})

// API routes
app.use('/api', levelingRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  })
})

// Start server
app.listen(PORT, () => {
  logger.info(`Leveling Engine service started on port ${PORT}`)
  logger.info('Environment:', process.env.NODE_ENV || 'development')
  
  // Initialize cron jobs
  cronJobs.init()
  logger.info('Cron jobs initialized')
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully')
  cronJobs.stop()
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully')
  cronJobs.stop()
  process.exit(0)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception:', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

export default app
