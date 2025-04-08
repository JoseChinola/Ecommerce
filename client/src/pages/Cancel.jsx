import React from 'react'
import { Link } from 'react-router-dom'

const Cancel = () => {
    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 p-2 rounded z-40 bg-neutral-800 bg-opacity-70 flex items-center justify-center'>

            <div className='m-2 w-full max-w-md h-full max-h-52 bg-red-200 p-4 py-5 mx-auto flex flex-col justify-center items-center gap-4 rounded-md'>
                <p className='text-red-800 font-bold text-lg text-center'>Order Cancel </p>
                <Link to="/" className='border border-red-900 text-red-900 hover:bg-red-900 hover:text-white bg- px-4 py-1 capitalize transition-all rounded-md'>
                    Go to Home</Link>
            </div>
        </section>
    )
}

export default Cancel