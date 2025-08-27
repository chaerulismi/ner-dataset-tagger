import React from 'react'
import { useNER } from '../contexts/NERContext'
import { Database, Check } from 'lucide-react'

const DatasetSelector: React.FC = () => {
  const { state, dispatch } = useNER()

  const handleSelectDataset = (dataset: any) => {
    dispatch({ type: 'SET_CURRENT_DATASET', payload: dataset })
  }

  if (state.datasets.length === 0) {
    return null
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Dataset</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.datasets.map((dataset) => (
          <div
            key={dataset.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              state.currentDataset?.id === dataset.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => handleSelectDataset(dataset)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{dataset.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {dataset.description}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Database className="h-3 w-3" />
                    <span>{dataset.samples.length} samples</span>
                  </span>
                  <span>
                    {dataset.samples.reduce((sum, sample) => sum + sample.entities.length, 0)} entities
                  </span>
                </div>
              </div>
              {state.currentDataset?.id === dataset.id && (
                <div className="p-1 bg-primary-500 rounded-full">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DatasetSelector
