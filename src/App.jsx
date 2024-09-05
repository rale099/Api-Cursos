import './App.css'

import Navbar from './dashboard/Navbar'
import Sidebar from './dashboard/Sidebar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './dashboard/Dashboard'
import Especialidad from './components/Especialidad'
import Footer from './dashboard/Footer'
import React from 'react'
import Curso from './components/Curso'
import InscripcionCliente from './components/inscripciones/inscripcionCliente'


function App() {
  return (
    <Router>
      <div className='flex flex-col md:flex-row h-screen'>
          <Sidebar />
          <div className='flex flex-col flex-grow'>
              <Navbar />
              <div className='flex-grow overflow-y-auto p-4 bg-gray-100'>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/especialidades" element={<Especialidad />} />
                    <Route path="/cursos" element={<Curso />} />
                    <Route path='/inscripciones' element={<InscripcionCliente />} />
                  </Routes>
              </div>
              <Footer />
          </div>  
      </div>
    </Router>
  );
}

export default App