import React, { createContext, useContext, useReducer, ReactNode } from 'react'

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

const initialState: NERState = {
  datasets: [],
  currentDataset: null,
  currentSample: null,
  entityTypes: ['PERSON', 'ORGANIZATION', 'LOCATION', 'DATE', 'MONEY', 'PERCENT', 'TIME']
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
      return {
        ...state,
        datasets: state.datasets.map(dataset =>
          dataset.id === action.payload.datasetId
            ? {
                ...dataset,
                samples: dataset.samples.map(sample =>
                  sample.id === action.payload.sample.id ? action.payload.sample : sample
                )
              }
            : dataset
        ),
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
    
    default:
      return state
  }
}

interface NERContextType {
  state: NERState
  dispatch: React.Dispatch<NERAction>
  createDataset: (name: string, description: string) => void
  addSample: (text: string) => void
  updateSample: (sample: NERSample) => void
  addEntity: (entity: Omit<Entity, 'id'>) => void
  removeEntity: (entityId: string) => void
  exportDataset: (datasetId: string) => void
}

const NERContext = createContext<NERContextType | undefined>(undefined)

export function NERProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(nerReducer, initialState)

  const createDataset = (name: string, description: string) => {
    console.log('Creating dataset:', { name, description })
    const newDataset: NERDataset = {
      id: Date.now().toString(),
      name,
      description,
      samples: [],
      entityTypes: [...state.entityTypes],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    console.log('New dataset object:', newDataset)
    dispatch({ type: 'CREATE_DATASET', payload: newDataset })
    // Automatically set the new dataset as current
    dispatch({ type: 'SET_CURRENT_DATASET', payload: newDataset })
    console.log('Dataset created successfully and set as current')
  }

  const addSample = (text: string) => {
    console.log('addSample called with text:', text)
    console.log('Current dataset:', state.currentDataset)
    
    if (!state.currentDataset) {
      console.error('No current dataset set')
      return
    }
    
    const newSample: NERSample = {
      id: Date.now().toString(),
      text,
      entities: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    console.log('Creating new sample:', newSample)
    
    dispatch({
      type: 'ADD_SAMPLE',
      payload: { datasetId: state.currentDataset.id, sample: newSample }
    })
    
    // Log the state after dispatch
    setTimeout(() => {
      console.log('State after dispatch - datasets:', state.datasets.length)
      console.log('State after dispatch - currentDataset samples:', state.currentDataset?.samples.length)
    }, 0)
    
    console.log('Sample added successfully')
  }

  const updateSample = (sample: NERSample) => {
    if (!state.currentDataset) return
    
    const updatedSample = { ...sample, updatedAt: new Date() }
    dispatch({
      type: 'UPDATE_SAMPLE',
      payload: { datasetId: state.currentDataset.id, sample: updatedSample }
    })
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

  const value: NERContextType = {
    state,
    dispatch,
    createDataset,
    addSample,
    updateSample,
    addEntity,
    removeEntity,
    exportDataset
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
