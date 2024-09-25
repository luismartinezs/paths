import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'
import { initializeDatabase } from './db/database'

const Root: React.FC = () => {
  const [dbReady, setDbReady] = useState(false)

  useEffect(() => {
    initializeDatabase()
      .then(() => {
        setDbReady(true)
      })
      .catch((error) => {
        console.error('Failed to initialize database:', error)
      })
  }, [])

  return <App dbReady={dbReady} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
