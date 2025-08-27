import React, { useState, useRef, useEffect } from 'react'
import { useNER } from '../contexts/NERContext'
import { Plus, Save, Trash2, Download } from 'lucide-react'
import TextAnnotator from '../components/TextAnnotator'
import DatasetSelector from '../components/DatasetSelector'

const Annotator: React.FC = () => {
  const { state, addSample, updateSample, exportDataset, createDataset } = useNER()
  const [selectedText, setSelectedText] = useState('')
  const [selectedEntityType, setSelectedEntityType] = useState('')
  const [isAddingSample, setIsAddingSample] = useState(false)
  const [newSampleText, setNewSampleText] = useState('')

  const handleAddSample = () => {
    console.log('handleAddSample called')
    console.log('newSampleText:', newSampleText)
    console.log('currentDataset:', state.currentDataset)
    
    // Add alert to confirm function is called
    alert(`Attempting to add sample: "${newSampleText.substring(0, 50)}..."`)
    
    if (newSampleText.trim() && state.currentDataset) {
      console.log('Calling addSample with:', newSampleText.trim())
      addSample(newSampleText.trim())
      setNewSampleText('')
      setIsAddingSample(false)
      console.log('Sample added successfully')
      alert('Sample added successfully!')
    } else {
      console.error('Cannot add sample:', { 
        hasText: !!newSampleText.trim(), 
        hasDataset: !!state.currentDataset 
      })
      alert(`Cannot add sample: hasText=${!!newSampleText.trim()}, hasDataset=${!!state.currentDataset}`)
    }
  }

  const handleExport = () => {
    if (state.currentDataset) {
      exportDataset(state.currentDataset.id)
    }
  }

  const handleCreateDataset = () => {
    const name = prompt('Enter dataset name:')
    const description = prompt('Enter dataset description:')
    if (name && description) {
      createDataset(name, description)
    }
  }

  if (!state.currentDataset) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Text Annotation</h1>
          <p className="text-gray-600">Select or create a dataset to start annotating text samples.</p>
        </div>
        
        <DatasetSelector />
        
        <div className="card text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Dataset</h2>
          <button
            onClick={handleCreateDataset}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Dataset
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Text Annotation</h1>
          <p className="text-gray-600">
            Working with dataset: <span className="font-semibold">{state.currentDataset.name}</span>
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="btn-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Dataset
          </button>
        </div>
      </div>

      {/* Dataset Info */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Dataset Information</h2>
          <span className="text-sm text-gray-500">
            {state.currentDataset.samples.length} samples, 
            {state.currentDataset.samples.reduce((sum, sample) => sum + sample.entities.length, 0)} entities
          </span>
        </div>
        <p className="text-gray-600">{state.currentDataset.description}</p>
      </div>

      {/* Add New Sample */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add New Sample</h2>
          <button
            onClick={() => setIsAddingSample(!isAddingSample)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAddingSample ? 'Cancel' : 'Add Sample'}
          </button>
        </div>
        
        {isAddingSample && (
          <div className="space-y-4">
            <textarea
              value={newSampleText}
              onChange={(e) => setNewSampleText(e.target.value)}
              placeholder="Enter the text you want to annotate..."
              className="input-field h-32 resize-none"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAddingSample(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSample}
                className="btn-primary"
                disabled={!newSampleText.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                Add Sample
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sample List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Text Samples</h2>
        {/* Debug info */}
        <div className="text-xs text-gray-500 mb-2">
          Debug: {state.currentDataset.samples.length} samples in current dataset
        </div>
        {state.currentDataset.samples.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No samples yet. Add your first text sample above.
          </div>
        ) : (
          <div className="space-y-4">
            {state.currentDataset.samples.map((sample) => (
              <div key={sample.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    Sample ID: {sample.id} • {sample.entities.length} entities
                  </span>
                  <button
                    onClick={() => {
                      // Set current sample for editing
                      // This would typically update the context
                    }}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
                <TextAnnotator
                  text={sample.text}
                  entities={sample.entities}
                  entityTypes={state.entityTypes}
                  onEntitiesChange={(entities) => {
                    console.log('onEntitiesChange called with entities:', entities)
                    const updatedSample = { ...sample, entities }
                    console.log('Calling updateSample with:', updatedSample)
                    updateSample(updatedSample)
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Annotator
