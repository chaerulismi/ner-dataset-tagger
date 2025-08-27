import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { databaseService, DatabaseDataset, DatabaseSample, DatabaseEntity } from '../services/database'

export interface Entity {
  id: string
  text: string
  type: string
  start: number
  end: number
}

export interface NERSample {
  id: string
  text: string
  entities: Entity[]
  createdAt: Date
  updatedAt: Date
}

export interface NERDataset {
  id: string
  name: string
  description: string
  samples: NERSample[]
  entityTypes: string[]
  createdAt: Date
  updatedAt: Date
}

interface NERState {
  datasets: NERDataset[]
  currentDataset: NERDataset | null
  currentSample: NERSample | null
  entityTypes: string[]
  isLoading: boolean
  error: string | null
}

type NERAction =
  | { type: 'CREATE_DATASET'; payload: NERDataset }
  | { type: 'UPDATE_DATASET'; payload: NERDataset }
  | { type: 'DELETE_DATASET'; payload: string }
  | { type: 'SET_CURRENT_DATASET'; payload: NERDataset | null }
  | { type: 'SET_CURRENT_SAMPLE'; payload: NERSample | null }
  | { type: 'ADD_SAMPLE'; payload: { datasetId: string; sample: NERSample } }
  | { type: 'UPDATE_SAMPLE'; payload: { datasetId: string; sample: NERSample } }
  | { type: 'DELETE_SAMPLE'; payload: { datasetId: string; sampleId: string } }
  | { type: 'ADD_ENTITY_TYPE'; payload: string }
  | { type: 'REMOVE_ENTITY_TYPE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_DATASETS'; payload: NERDataset[] }

const initialState: NERState = {
  datasets: [],
  currentDataset: null,
  currentSample: null,
  entityTypes: ['PERSON', 'ORGANIZATION', 'LOCATION', 'DATE', 'MONEY', 'PERCENT', 'TIME'],
  isLoading: true,
  error: null
}

function nerReducer(state: NERState, action: NERAction): NERState {
  console.log('Reducer action:', action.type, action.payload)
  
  switch (action.type) {
    case 'CREATE_DATASET':
      console.log('Processing CREATE_DATASET, current datasets:', state.datasets.length)
      const newState = {
        ...state,
        datasets: [...state.datasets, action.payload]
      }
      console.log('New state datasets count:', newState.datasets.length)
      return newState
    
    case 'UPDATE_DATASET':
      return {
        ...state,
        datasets: state.datasets.map(dataset =>
          dataset.id === action.payload.id ? action.payload : dataset
        ),
        currentDataset: state.currentDataset?.id === action.payload.id ? action.payload : state.currentDataset
      }
    
    case 'DELETE_DATASET':
      return {
        ...state,
        datasets: state.datasets.filter(dataset => dataset.id !== action.payload),
        currentDataset: state.currentDataset?.id === action.payload ? null : state.currentDataset
      }
    
    case 'SET_CURRENT_DATASET':
      return {
        ...state,
        currentDataset: action.payload
      }
    
    case 'SET_CURRENT_SAMPLE':
      return {
        ...state,
        currentSample: action.payload
      }
    
    case 'ADD_SAMPLE':
      console.log('Processing ADD_SAMPLE, datasetId:', action.payload.datasetId)
      console.log('Current datasets:', state.datasets.map(d => ({ id: d.id, name: d.name })))
      const updatedDatasets = state.datasets.map(dataset =>
        dataset.id === action.payload.datasetId
          ? { ...dataset, samples: [...dataset.samples, action.payload.sample] }
          : dataset
      )
      
      // Also update the currentDataset reference
      const updatedCurrentDataset = state.currentDataset?.id === action.payload.datasetId
        ? { ...state.currentDataset, samples: [...state.currentDataset.samples, action.payload.sample] }
        : state.currentDataset
      
      return {
        ...state,
        datasets: updatedDatasets,
        currentDataset: updatedCurrentDataset
      }
    
    case 'UPDATE_SAMPLE':
      const updatedDatasetsForSample = state.datasets.map(dataset =>
        dataset.id === action.payload.datasetId
          ? {
              ...dataset,
              samples: dataset.samples.map(sample =>
                sample.id === action.payload.sample.id ? action.payload.sample : sample
              )
            }
          : dataset
      )
      
      // Also update the currentDataset reference
      const updatedCurrentDatasetForSample = state.currentDataset?.id === action.payload.datasetId
        ? {
            ...state.currentDataset,
            samples: state.currentDataset.samples.map(sample =>
              sample.id === action.payload.sample.id ? action.payload.sample : sample
            )
          }
        : state.currentDataset
      
      return {
        ...state,
        datasets: updatedDatasetsForSample,
        currentDataset: updatedCurrentDatasetForSample,
        currentSample: state.currentSample?.id === action.payload.sample.id ? action.payload.sample : state.currentSample
      }
    
    case 'DELETE_SAMPLE':
      return {
        ...state,
        datasets: state.datasets.map(dataset =>
          dataset.id === action.payload.datasetId
            ? {
                ...dataset,
                samples: dataset.samples.filter(sample => sample.id !== action.payload.sampleId)
              }
            : dataset
        ),
        currentSample: state.currentSample?.id === action.payload.sampleId ? null : state.currentSample
      }
    
    case 'ADD_ENTITY_TYPE':
      return {
        ...state,
        entityTypes: [...state.entityTypes, action.payload]
      }
    
    case 'REMOVE_ENTITY_TYPE':
      return {
        ...state,
        entityTypes: state.entityTypes.filter(type => type !== action.payload)
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }
    
    case 'LOAD_DATASETS':
      return {
        ...state,
        datasets: action.payload
      }
    
    default:
      return state
  }
}

interface NERContextType {
  state: NERState
  dispatch: React.Dispatch<NERAction>
  createDataset: (name: string, description: string) => Promise<void>
  addSample: (text: string) => Promise<void>
  updateSample: (sample: NERSample) => Promise<void>
  addEntity: (entity: Omit<Entity, 'id'>) => void
  removeEntity: (entityId: string) => void
  exportDataset: (datasetId: string) => void
  getDatasetStats: () => Promise<{ totalDatasets: number; totalSamples: number; totalEntities: number }>
  testDatabaseConnection: () => Promise<boolean>
}

const NERContext = createContext<NERContextType | undefined>(undefined)

export function NERProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(nerReducer, initialState)

  // Test database connection
  const testDatabaseConnection = async () => {
    try {
      console.log('Testing database connection...')
      const stats = await databaseService.getDatasetStats()
      console.log('Database connection successful, stats:', stats)
      return true
    } catch (error) {
      console.error('Database connection failed:', error)
      return false
    }
  }

  // Load datasets from database on mount
  useEffect(() => {
    const loadDatasets = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        
        // Test database connection first
        const isConnected = await testDatabaseConnection()
        if (!isConnected) {
          throw new Error('Database connection failed')
        }
        
        console.log('Loading datasets from database...')
        const dbDatasets = await databaseService.getAllDatasets()
        console.log('Raw database datasets:', dbDatasets)
        
        // Convert database format to app format
        const appDatasets: NERDataset[] = dbDatasets.map(dbDataset => ({
          id: dbDataset.id,
          name: dbDataset.name,
          description: dbDataset.description,
          samples: dbDataset.samples.map(dbSample => ({
            id: dbSample.id,
            text: dbSample.text,
            entities: dbSample.entities.map(dbEntity => ({
              id: dbEntity.id,
              text: dbEntity.text,
              type: dbEntity.type,
              start: dbEntity.start,
              end: dbEntity.end,
            })),
            createdAt: dbSample.createdAt,
            updatedAt: dbSample.updatedAt,
          })),
          entityTypes: ['PERSON', 'ORGANIZATION', 'LOCATION', 'DATE', 'MONEY', 'PERCENT', 'TIME'],
          createdAt: dbDataset.createdAt,
          updatedAt: dbDataset.updatedAt,
        }))
        
        console.log('Converted app datasets:', appDatasets)
        dispatch({ type: 'LOAD_DATASETS', payload: appDatasets })
        
        // Set the first dataset as current if available
        if (appDatasets.length > 0) {
          dispatch({ type: 'SET_CURRENT_DATASET', payload: appDatasets[0] })
        }
      } catch (error) {
        console.error('Error loading datasets:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to load datasets'
        dispatch({ type: 'SET_ERROR', payload: errorMessage })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    loadDatasets()
  }, [])

  const createDataset = async (name: string, description: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      console.log('Creating dataset:', { name, description })
      
      // Validate inputs
      if (!name.trim() || !description.trim()) {
        throw new Error('Name and description are required')
      }
      
      console.log('Calling databaseService.createDataset...')
      const dbDataset = await databaseService.createDataset(name.trim(), description.trim())
      console.log('Database response:', dbDataset)
      
      const newDataset: NERDataset = {
        id: dbDataset.id,
        name: dbDataset.name,
        description: dbDataset.description,
        samples: [],
        entityTypes: [...state.entityTypes],
        createdAt: dbDataset.createdAt,
        updatedAt: dbDataset.updatedAt
      }
      
      console.log('New dataset object:', newDataset)
      console.log('Dispatching CREATE_DATASET action...')
      dispatch({ type: 'CREATE_DATASET', payload: newDataset })
      console.log('CREATE_DATASET dispatched successfully')
      
      // Automatically set the new dataset as current
      console.log('Setting new dataset as current...')
      dispatch({ type: 'SET_CURRENT_DATASET', payload: newDataset })
      console.log('Dataset created successfully and set as current')
      
      // Clear any previous errors
      dispatch({ type: 'SET_ERROR', payload: null })
      
    } catch (error) {
      console.error('Error creating dataset:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create dataset'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw error // Re-throw to let the component handle it
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const addSample = async (text: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      console.log('addSample called with text:', text)
      console.log('Current dataset:', state.currentDataset)
      
      if (!state.currentDataset) {
        console.error('No current dataset set')
        return
      }
      
      const dbSample = await databaseService.createSample(state.currentDataset.id, text)
      
      const newSample: NERSample = {
        id: dbSample.id,
        text: dbSample.text,
        entities: [],
        createdAt: dbSample.createdAt,
        updatedAt: dbSample.updatedAt
      }
      
      console.log('Creating new sample:', newSample)
      
      dispatch({
        type: 'ADD_SAMPLE',
        payload: { datasetId: state.currentDataset.id, sample: newSample }
      })
      
      console.log('Sample added successfully')
    } catch (error) {
      console.error('Error adding sample:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add sample' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateSample = async (sample: NERSample) => {
    try {
      if (!state.currentDataset) return
      
      const updatedSample = { ...sample, updatedAt: new Date() }
      
      // Convert to database format
      const dbEntities = sample.entities.map(entity => ({
        id: entity.id,
        text: entity.text,
        type: entity.type,
        start: entity.start,
        end: entity.end,
        createdAt: new Date(),
      }))
      
      await databaseService.updateSample(sample.id, sample.text, dbEntities)
      
      dispatch({
        type: 'UPDATE_SAMPLE',
        payload: { datasetId: state.currentDataset.id, sample: updatedSample }
      })
    } catch (error) {
      console.error('Error updating sample:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update sample' })
    }
  }

  const addEntity = (entity: Omit<Entity, 'id'>) => {
    if (!state.currentSample) return
    
    const newEntity: Entity = {
      ...entity,
      id: Date.now().toString()
    }
    
    const updatedSample: NERSample = {
      ...state.currentSample,
      entities: [...state.currentSample.entities, newEntity],
      updatedAt: new Date()
    }
    
    updateSample(updatedSample)
  }

  const removeEntity = (entityId: string) => {
    if (!state.currentSample) return
    
    const updatedSample: NERSample = {
      ...state.currentSample,
      entities: state.currentSample.entities.filter(entity => entity.id !== entityId),
      updatedAt: new Date()
    }
    
    updateSample(updatedSample)
  }

  const exportDataset = (datasetId: string) => {
    const dataset = state.datasets.find(d => d.id === datasetId)
    if (!dataset) return

    // Convert to HuggingFace format
    const hfFormat = dataset.samples.map(sample => ({
      text: sample.text,
      entities: sample.entities.map(entity => ({
        start: entity.start,
        end: entity.end,
        label: entity.type
      }))
    }))

    const dataStr = JSON.stringify(hfFormat, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `${dataset.name}_ner_dataset.json`
    link.click()
  }

  const getDatasetStats = async () => {
    try {
      return await databaseService.getDatasetStats()
    } catch (error) {
      console.error('Error getting dataset stats:', error)
      return { totalDatasets: 0, totalSamples: 0, totalEntities: 0 }
    }
  }

  const value: NERContextType = {
    state,
    dispatch,
    createDataset,
    addSample,
    updateSample,
    addEntity,
    removeEntity,
    exportDataset,
    getDatasetStats,
    testDatabaseConnection
  }

  return (
    <NERContext.Provider value={value}>
      {children}
    </NERContext.Provider>
  )
}

export function useNER() {
  const context = useContext(NERContext)
  if (context === undefined) {
    throw new Error('useNER must be used within a NERProvider')
  }
  return context
}
