import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3002

// Middleware
app.use(cors())
app.use(express.json())

// Test database connection
app.get('/api/health', async (req, res) => {
  try {
    const stats = await prisma.dataset.count()
    res.json({ 
      status: 'ok', 
      message: 'Database connected successfully',
      datasetCount: stats 
    })
  } catch (error) {
    console.error('Database connection error:', error)
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Get all datasets
app.get('/api/datasets', async (req, res) => {
  try {
    const datasets = await prisma.dataset.findMany({
      include: {
        samples: {
          include: {
            entities: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })
    res.json(datasets)
  } catch (error) {
    console.error('Error fetching datasets:', error)
    res.status(500).json({ 
      error: 'Failed to fetch datasets',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Create dataset
app.post('/api/datasets', async (req, res) => {
  try {
    const { name, description } = req.body
    
    if (!name || !description) {
      return res.status(400).json({ 
        error: 'Name and description are required' 
      })
    }
    
    console.log('Creating dataset:', { name, description })
    
    const dataset = await prisma.dataset.create({
      data: {
        name: name.trim(),
        description: description.trim(),
      },
      include: {
        samples: {
          include: {
            entities: true,
          },
        },
      },
    })
    
    console.log('Dataset created successfully:', dataset)
    res.status(201).json(dataset)
  } catch (error) {
    console.error('Error creating dataset:', error)
    res.status(500).json({ 
      error: 'Failed to create dataset',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Create sample
app.post('/api/samples', async (req, res) => {
  try {
    const { datasetId, text } = req.body
    
    if (!datasetId || !text) {
      return res.status(400).json({ 
        error: 'Dataset ID and text are required' 
      })
    }
    
    const sample = await prisma.sample.create({
      data: {
        text: text.trim(),
        datasetId,
      },
      include: {
        entities: true,
      },
    })
    
    res.status(201).json(sample)
  } catch (error) {
    console.error('Error creating sample:', error)
    res.status(500).json({ 
      error: 'Failed to create sample',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Update sample
app.put('/api/samples/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { text, entities } = req.body
    
    if (!text) {
      return res.status(400).json({ 
        error: 'Text is required' 
      })
    }
    
    // First, delete existing entities
    await prisma.entity.deleteMany({
      where: { sampleId: id },
    })
    
    // Then update the sample and create new entities
    const sample = await prisma.sample.update({
      where: { id },
      data: {
        text: text.trim(),
        updatedAt: new Date(),
        entities: {
          create: entities.map((entity: any) => ({
            text: entity.text,
            type: entity.type,
            start: entity.start,
            end: entity.end,
          })),
        },
      },
      include: {
        entities: true,
      },
    })
    
    res.json(sample)
  } catch (error) {
    console.error('Error updating sample:', error)
    res.status(500).json({ 
      error: 'Failed to update sample',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Get dataset stats
app.get('/api/stats', async (req, res) => {
  try {
    const [datasets, samples, entities] = await Promise.all([
      prisma.dataset.count(),
      prisma.sample.count(),
      prisma.entity.count(),
    ])
    
    res.json({
      totalDatasets: datasets,
      totalSamples: samples,
      totalEntities: entities,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ 
      error: 'Failed to fetch stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    PORT
  })
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...')
  await prisma.$disconnect()
  process.exit(0)
})
