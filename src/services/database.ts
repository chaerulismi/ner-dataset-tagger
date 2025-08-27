const API_BASE_URL = 'http://localhost:3002/api'

export interface DatabaseDataset {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  samples: DatabaseSample[]
}

export interface DatabaseSample {
  id: string
  text: string
  createdAt: Date
  updatedAt: Date
  entities: DatabaseEntity[]
}

export interface DatabaseEntity {
  id: string
  text: string
  type: string
  start: number
  end: number
  createdAt: Date
}

export class DatabaseService {
  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      const data = await response.json()
      return data.status === 'ok'
    } catch (error) {
      console.error('Database connection test failed:', error)
      return false
    }
  }

  // Dataset operations
  async createDataset(name: string, description: string): Promise<DatabaseDataset> {
    try {
      console.log('DatabaseService.createDataset called with:', { name, description })
      
      if (!name.trim() || !description.trim()) {
        throw new Error('Name and description are required')
      }
      
      console.log('Creating dataset via API...')
      const response = await fetch(`${API_BASE_URL}/datasets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      const result = await response.json()
      console.log('Dataset created successfully via API:', result)
      return result
      
    } catch (error) {
      console.error('Database error in createDataset:', error)
      throw new Error(`Failed to create dataset: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getDataset(id: string): Promise<DatabaseDataset | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/datasets`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const datasets = await response.json()
      return datasets.find((d: DatabaseDataset) => d.id === id) || null
    } catch (error) {
      console.error('Error fetching dataset:', error)
      return null
    }
  }

  async getAllDatasets(): Promise<DatabaseDataset[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/datasets`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching datasets:', error)
      return []
    }
  }

  async updateDataset(id: string, name: string, description: string): Promise<DatabaseDataset> {
    // Note: This endpoint doesn't exist yet in the server, but we can add it
    throw new Error('Update dataset not implemented yet')
  }

  async deleteDataset(id: string): Promise<void> {
    // Note: This endpoint doesn't exist yet in the server, but we can add it
    throw new Error('Delete dataset not implemented yet')
  }

  // Sample operations
  async createSample(datasetId: string, text: string): Promise<DatabaseSample> {
    try {
      const response = await fetch(`${API_BASE_URL}/samples`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datasetId,
          text: text.trim(),
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error creating sample:', error)
      throw new Error(`Failed to create sample: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async updateSample(id: string, text: string, entities: DatabaseEntity[]): Promise<DatabaseSample> {
    try {
      const response = await fetch(`${API_BASE_URL}/samples/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          entities,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating sample:', error)
      throw new Error(`Failed to update sample: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async deleteSample(id: string): Promise<void> {
    // Note: This endpoint doesn't exist yet in the server, but we can add it
    throw new Error('Delete sample not implemented yet')
  }

  // Entity operations
  async addEntity(sampleId: string, entity: Omit<DatabaseEntity, 'id' | 'createdAt'>): Promise<DatabaseEntity> {
    // Note: This endpoint doesn't exist yet in the server, but we can add it
    throw new Error('Add entity not implemented yet')
  }

  async removeEntity(id: string): Promise<void> {
    // Note: This endpoint doesn't exist yet in the server, but we can add it
    throw new Error('Remove entity not implemented yet')
  }

  // Utility methods
  async getDatasetStats(): Promise<{
    totalDatasets: number
    totalSamples: number
    totalEntities: number
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching stats:', error)
      return {
        totalDatasets: 0,
        totalSamples: 0,
        totalEntities: 0,
      }
    }
  }

  async close(): Promise<void> {
    // No need to close anything for fetch API
  }
}

export const databaseService = new DatabaseService()
