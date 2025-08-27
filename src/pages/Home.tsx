import React from 'react'
import { Link } from 'react-router-dom'
import { useNER } from '../contexts/NERContext'
import { Plus, FileText, Download, BarChart3 } from 'lucide-react'

const Home: React.FC = () => {
  const { state } = useNER()
  const totalDatasets = state.datasets.length
  const totalSamples = state.datasets.reduce((sum, dataset) => sum + dataset.samples.length, 0)
  const totalEntities = state.datasets.reduce((sum, dataset) => 
    sum + dataset.samples.reduce((sSum, sample) => sSum + sample.entities.length, 0), 0
  )

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Create NER Training Datasets
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Build high-quality Named Entity Recognition training datasets that are compatible with HuggingFace models. 
          Annotate text, manage entities, and export your data in the perfect format for training.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/annotate"
          className="card hover:shadow-md transition-shadow duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors duration-200">
              <Plus className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Start Annotating</h3>
              <p className="text-gray-600">Create new text samples and annotate entities</p>
            </div>
          </div>
        </Link>

        <Link
          to="/datasets"
          className="card hover:shadow-md transition-shadow duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Manage Datasets</h3>
              <p className="text-gray-600">View, edit, and organize your datasets</p>
            </div>
          </div>
        </Link>

        <div className="card hover:shadow-md transition-shadow duration-200 group">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-200">
              <Download className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
              <p className="text-gray-600">Download datasets in HuggingFace format</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">{totalDatasets}</div>
            <div className="text-gray-600">Datasets Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{totalSamples}</div>
            <div className="text-gray-600">Text Samples</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{totalEntities}</div>
            <div className="text-gray-600">Entities Annotated</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Entity Type Management</h3>
                <p className="text-gray-600">Customize entity types for your specific domain</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Interactive Annotation</h3>
                <p className="text-gray-600">Click and drag to select text spans for entities</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Download className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">HuggingFace Compatible</h3>
                <p className="text-gray-600">Export datasets in the exact format needed for training</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Progress Tracking</h3>
                <p className="text-gray-600">Monitor your annotation progress and dataset statistics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
