import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Annotator from './pages/Annotator'
import DatasetManager from './pages/DatasetManager'
import DatabaseViewer from './components/DatabaseViewer'
import { NERProvider } from './contexts/NERContext'

function App() {
  return (
    <NERProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/annotate" element={<Annotator />} />
              <Route path="/datasets" element={<DatasetManager />} />
              <Route path="/database" element={<DatabaseViewer />} />
            </Routes>
          </main>
        </div>
      </Router>
    </NERProvider>
  )
}

export default App
