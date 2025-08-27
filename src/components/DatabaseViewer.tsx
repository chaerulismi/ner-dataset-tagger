import React, { useState, useEffect } from 'react'
import { useNER } from '../contexts/NERContext'
import { Database, Eye, Download, Trash2 } from 'lucide-react'

const DatabaseViewer: React.FC = () => {
  const { state, getDatasetStats, exportDataset } = useNER()
  const [stats, setStats] = useState<{
    totalDatasets: number
    totalSamples: number
    totalEntities: number
  }>({ totalDatasets: 0, totalSamples: 0, totalEntities: 0 })

  useEffect(() => {
    const loadStats = async () => {
      const databaseStats = await getDatasetStats()
      setStats(databaseStats)
    }
    loadStats()
  }, [getDatasetStats, state.datasets])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Database className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Database Contents</h2>
      </div>

      {/* Database Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="text-3xl font-bold text-blue-600">{stats.totalDatasets}</div>
          <div className="text-sm text-gray-600">Total Datasets</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="text-3xl font-bold text-green-600">{stats.totalSamples}</div>
          <div className="text-sm text-gray-600">Total Samples</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="text-3xl font-bold text-purple-600">{stats.totalEntities}</div>
          <div className="text-sm text-gray-600">Total Entities</div>
        </div>
      </div>

      {/* Datasets List */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Stored Datasets</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {state.datasets.map((dataset) => (
            <div key={dataset.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">{dataset.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{dataset.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>{dataset.samples.length} samples</span>
                    <span>Created {dataset.createdAt.toLocaleDateString()}</span>
                    <span>Updated {dataset.updatedAt.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => exportDataset(dataset.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Export Dataset"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Samples in this dataset */}
              {dataset.samples.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h5 className="text-sm font-medium text-gray-700">Samples:</h5>
                  {dataset.samples.map((sample) => (
                    <div key={sample.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-900 mb-2">{sample.text}</div>
                      {sample.entities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {sample.entities.map((entity) => (
                            <span
                              key={entity.id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {entity.type}: "{entity.text}"
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Database Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Database className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Database Information</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your NER datasets are now stored in a SQLite database. Data persists between sessions and can be exported in HuggingFace format.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatabaseViewer
