
import React, { useState } from 'react'
import { FaCircleUser } from "react-icons/fa6";
const Navbar = () => {
    const [dropdownOpen, setDropdowOpen] = useState(false);
  return (
    <div className='bg-gray-900 text-white p-4 flex items-center justify-between'>
      <span className='text-lg'>Bienvenido admin</span>
      <div className='relative'>
        <button className='flex items-center focus:outline-none'
         onClick={() => setDropdowOpen(!dropdownOpen)}>
            <FaCircleUser className='text-2x1 mr-2' />
            <span className='text-sm'>Admin</span>
        </button>
        {dropdownOpen &&(
                <div className='absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg'>
                    <a href='#' className='block px-4 py-2 text-sm hover:bg-gray-200'>Perfil</a>
                    <a href='#' className='block px-4 py-2 text-sm hover:bg-gray-200'>Cerrar</a>
                </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
