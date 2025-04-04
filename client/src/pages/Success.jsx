import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Success = () => {
    const location = useLocation()

    console.log("location",)

    return (
        <section className='m-2 w-full max-w-md bg-green-200 p-4 py-5 mx-auto flex flex-col justify-center items-center gap-4 rounded-md'>
            <p className='text-green-800 font-bold text-lg text-center'>{Boolean(location?.state?.text) ? location.state.text : "Payment"} Successfully </p>
            <Link to="/" className='border border-green-900 text-green-900 hover:bg-green-900 hover:text-white bg- px-4 py-1 capitalize transition-all rounded-md'>Go to Home</Link>
        </section>
    )
}

export default Success