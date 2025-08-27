import React, { useState } from 'react'
import { useNER } from '../contexts/NERContext'
import { Plus, Edit, Trash2, Download, Eye, Calendar, FileText } from 'lucide-react'

const DatasetManager: React.FC = () => {
  const { state, dispatch, createDataset, exportDataset } = useNER()
  const [isCreating, setIsCreating] = useState(false)
  const [newDatasetName, setNewDatasetName] = useState('')
  const [newDatasetDescription, setNewDatasetDescription] = useState('')

  const handleCreateDataset = () => {
    if (newDatasetName.trim() && newDatasetDescription.trim()) {
      createDataset(newDatasetName.trim(), newDatasetDescription.trim())
      setNewDatasetName('')
      setNewDatasetDescription('')
      setIsCreating(false)
    }
  }

  const handleDeleteDataset = (datasetId: string) => {
    if (confirm('Are you sure you want to delete this dataset? This action cannot be undone.')) {
      dispatch({ type: 'DELETE_DATASET', payload: datasetId })
    }
  }

  const handleSetCurrentDataset = (dataset: any) => {
    dispatch({ type: 'SET_CURRENT_DATASET', payload: dataset })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dataset Manager</h1>
          <p className="text-gray-600">Create, manage, and export your NER datasets</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? 'Cancel' : 'Create Dataset'}
        </button>
        <button
          onClick={() => {
            console.log('Test button clicked')
            console.log('Current state:', state)
            alert('Test button clicked! Check console for logs.')
            createDataset('Test Dataset', 'This is a test dataset')
          }}
          className="btn-secondary ml-2"
        >
          Test Create
        </button>
      </div>

      {/* Create Dataset Form */}
      {isCreating && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Dataset</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="datasetName" className="block text-sm font-medium text-gray-700 mb-2">
                Dataset Name
              </label>
              <input
                id="datasetName"
                type="text"
                value={newDatasetName}
                onChange={(e) => setNewDatasetName(e.target.value)}
                placeholder="Enter dataset name..."
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="datasetDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="datasetDescription"
                value={newDatasetDescription}
                onChange={(e) => setNewDatasetDescription(e.target.value)}
                placeholder="Describe what this dataset is for..."
                className="input-field h-24 resize-none"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsCreating(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDataset}
                className="btn-primary"
                disabled={!newDatasetName.trim() || !newDatasetDescription.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Dataset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Datasets List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Datasets</h2>
        
        {state.datasets.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No datasets yet</p>
            <p className="text-gray-400">Create your first dataset to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {state.datasets.map((dataset) => (
              <div key={dataset.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{dataset.name}</h3>
                      {state.currentDataset?.id === dataset.id && (
                        <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{dataset.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{dataset.samples.length} samples</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Created {dataset.createdAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Updated {dataset.updatedAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleSetCurrentDataset(dataset)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                      title="Set as current dataset"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => exportDataset(dataset.id)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                      title="Export dataset"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDataset(dataset.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Delete dataset"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Entity Types */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Entity Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {dataset.entityTypes.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      {state.datasets.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Overall Statistics</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">{state.datasets.length}</div>
              <div className="text-gray-600">Total Datasets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {state.datasets.reduce((sum, dataset) => sum + dataset.samples.length, 0)}
              </div>
              <div className="text-gray-600">Total Samples</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {state.datasets.reduce((sum, dataset) => 
                  sum + dataset.samples.reduce((sSum, sample) => sSum + sample.entities.length, 0), 0
                )}
              </div>
              <div className="text-gray-600">Total Entities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {state.entityTypes.length}
              </div>
              <div className="text-gray-600">Entity Types</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DatasetManager
