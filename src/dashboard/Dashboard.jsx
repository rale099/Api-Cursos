import React from 'react'

const Dashboard = () => {
  return (
    <div className='p-6'>
      <h2 className='text-3xl font-semibold mb-4'>Dashboard</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        <div className='bg-white p-4 rounded shadow-md'>
            <h3 className='text-xl font-bold mb-2'>Estudiantes</h3>
            <p className='text-gray-700'>200 Estudiantes</p>
        </div>
        <div className='bg-white p-4 rounded shadow-md'>
            <h3 className='text-xl font-bold mb-2'>Cursos</h3>
            <p className='text-gray-700'>20 Curso Disponibles</p>
        </div>
        <div className='bg-white p-4 rounded shadow-md'>
            <h3 className='text-xl font-bold mb-2'>Inscritos</h3>
            <p className='text-gray-700'>150 Inscripciones</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard