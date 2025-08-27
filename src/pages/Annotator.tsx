import React, { useState, useRef, useEffect } from 'react'
import { useNER } from '../contexts/NERContext'
import { Plus, Save, Trash2, Download, X } from 'lucide-react'
import TextAnnotator from '../components/TextAnnotator'
import DatasetSelector from '../components/DatasetSelector'

const Annotator: React.FC = () => {
  const { state, addSample, updateSample, exportDataset, createDataset, testDatabaseConnection } = useNER()
  const [selectedText, setSelectedText] = useState('')
  const [selectedEntityType, setSelectedEntityType] = useState('')
  const [isAddingSample, setIsAddingSample] = useState(false)
  const [newSampleText, setNewSampleText] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newDatasetName, setNewDatasetName] = useState('')
  const [newDatasetDescription, setNewDatasetDescription] = useState('')
  const [isCreatingDataset, setIsCreatingDataset] = useState(false)
  const [createError, setCreateError] = useState('')
  const [dbTestResult, setDbTestResult] = useState<string>('')

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

  const handleCreateDataset = async () => {
    if (!newDatasetName.trim() || !newDatasetDescription.trim()) {
      setCreateError('Please fill in both name and description')
      return
    }

    setIsCreatingDataset(true)
    setCreateError('')

    try {
      console.log('Creating dataset:', { name: newDatasetName, description: newDatasetDescription })
      await createDataset(newDatasetName.trim(), newDatasetDescription.trim())
      
      // Reset form and close modal
      setNewDatasetName('')
      setNewDatasetDescription('')
      setShowCreateModal(false)
      
      console.log('Dataset created successfully')
    } catch (error) {
      console.error('Error creating dataset:', error)
      setCreateError('Failed to create dataset. Please try again.')
    } finally {
      setIsCreatingDataset(false)
    }
  }

  const openCreateModal = () => {
    console.log('openCreateModal called')
    setShowCreateModal(true)
    setNewDatasetName('')
    setNewDatasetDescription('')
    setCreateError('')
    console.log('Modal state set to true, showCreateModal:', true)
  }

  const testConnection = async () => {
    try {
      setDbTestResult('Testing...')
      const isConnected = await testDatabaseConnection()
      setDbTestResult(isConnected ? 'Database connected successfully!' : 'Database connection failed')
    } catch (error) {
      setDbTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Debug logging
  useEffect(() => {
    console.log('Modal state changed:', showCreateModal)
  }, [showCreateModal])

  if (!state.currentDataset) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Text Annotation</h1>
          <p className="text-gray-600">Select or create a dataset to start annotating text samples.</p>
        </div>
        
        {/* Error Display */}
        {state.error && (
          <div className="card bg-red-50 border-red-200">
            <div className="text-red-800">
              <h3 className="font-semibold mb-2">Error</h3>
              <p>{state.error}</p>
            </div>
          </div>
        )}
        
        <DatasetSelector />
        
        <div className="card text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Dataset</h2>
          <button
            onClick={openCreateModal}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Dataset
          </button>
        </div>

        {/* Database Test Section */}
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Connection Test</h3>
          <button
            onClick={testConnection}
            className="btn-secondary mb-3"
          >
            Test Database Connection
          </button>
          {dbTestResult && (
            <div className={`text-sm ${dbTestResult.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {dbTestResult}
            </div>
          )}
        </div>

        {/* Debug info */}
        <div className="text-xs text-gray-500 text-center">
          Debug: Modal state = {showCreateModal.toString()}
        </div>

        {/* Create Dataset Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Create New Dataset</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="dataset-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Dataset Name
                  </label>
                  <input
                    id="dataset-name"
                    type="text"
                    value={newDatasetName}
                    onChange={(e) => setNewDatasetName(e.target.value)}
                    placeholder="Enter dataset name"
                    className="input-field w-full"
                    disabled={isCreatingDataset}
                  />
                </div>
                
                <div>
                  <label htmlFor="dataset-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="dataset-description"
                    value={newDatasetDescription}
                    onChange={(e) => setNewDatasetDescription(e.target.value)}
                    placeholder="Enter dataset description"
                    className="input-field w-full h-24 resize-none"
                    disabled={isCreatingDataset}
                  />
                </div>
                
                {createError && (
                  <div className="text-red-600 text-sm">{createError}</div>
                )}
                
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="btn-secondary flex-1"
                    disabled={isCreatingDataset}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateDataset}
                    className="btn-primary flex-1"
                    disabled={isCreatingDataset || !newDatasetName.trim() || !newDatasetDescription.trim()}
                  >
                    {isCreatingDataset ? 'Creating...' : 'Create Dataset'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
                    console.log('=== onEntitiesChange called ===')
                    console.log('Sample ID:', sample.id)
                    console.log('Current entities:', sample.entities)
                    console.log('New entities:', entities)
                    const updatedSample = { ...sample, entities }
                    console.log('Updated sample:', updatedSample)
                    console.log('Calling updateSample...')
                    updateSample(updatedSample)
                    console.log('updateSample called')
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
