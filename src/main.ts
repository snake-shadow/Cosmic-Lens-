import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { fetchCelestialInfo } from './services/geminiService'

const App = () => {
  const [data, setData] = useState('Loading cosmic data...')
  
  useEffect(() => {
    fetchCelestialInfo().then(setData).catch(() => setData('Mock data ready!'))
  }, [])
  
  return (
    <div className="p-8 text-white bg-gradient-to-br from-black to-purple-900 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Cosmic Lens</h1>
      <div className="bg-white/10 p-6 rounded-xl max-w-md mx-auto">
        <p className="text-lg mb-4">{data}</p>
        <p className="text-sm text-purple-300">Mock mode active - no API key needed</p>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
