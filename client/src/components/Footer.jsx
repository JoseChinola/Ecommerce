import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";


const Footer = () => {
    return (
        <footer className='border-t h-12'>
            <div className='container mx-auto py-2 px-4 text-center flex flex-col lg:flex-row lg:justify-between items-center gap-2'>
                <p>&copy; All Rights Reserved 2025</p>

                <div className='flex items-center gap-4 justify-center text-2xl'>
                    <a href="" className='hover:text-blue-500'>
                        <FaFacebook />
                    </a>

                    <a href="" className='hover:text-red-500'>
                        <FaInstagram />
                    </a>


                    <a href="" className='hover:text-blue-600'>
                        <FaLinkedin />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer