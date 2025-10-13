import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import InstructorDashboard from './pages/InstructorDashboard.jsx'
import ParticipantDashboard from './pages/ParticipantDashboard.jsx'

const router = createBrowserRouter([
  { path: "/", element: <App />,
    children: [
      { index: true, element: <ParticipantDashboard /> },
      { path: "participant", element: <ParticipantDashboard /> },
      { path: "instructor", element: <InstructorDashboard /> }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
