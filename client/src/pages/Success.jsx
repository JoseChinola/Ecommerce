import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Success = () => {
    const location = useLocation()

    console.log("location",)

    return (

        <section className='fixed top-0 bottom-0 left-0 right-0 p-2 rounded z-40 bg-neutral-800 bg-opacity-70 flex items-center justify-center'>

            <div className='m-2 w-full max-w-md h-full max-h-52 bg-green-200 p-4 py-5 mx-auto flex flex-col justify-center items-center gap-4 rounded-md'>
                <p className='text-primary-Green font-bold text-lg text-center'>{Boolean(location?.state?.text) ? location.state.text : "Payment"} Successfully </p>
                <Link to="/" className='border border-primary-Green text-primary-Green hover:bg-primary-Green hover:text-white bg- px-4 py-1 capitalize transition-all rounded-md'>Go to Home</Link>
            </div>
        </section>
    )
}

export default Success