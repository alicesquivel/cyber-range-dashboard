import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Shell from './shell/Shell.jsx'
import Overview from './pages/Overview.jsx'
import Nodes from './pages/Nodes.jsx'
import Stacks from './pages/Stacks.jsx'
import Telemetry from './pages/Telemetry.jsx'

const router = createBrowserRouter([
  { path: "/", element: <Shell />,
    children: [
      { index: true, element: <Overview /> },
      { path: "nodes", element: <Nodes /> },
      { path: "stacks", element: <Stacks /> },
      { path: "telemetry", element: <Telemetry /> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
