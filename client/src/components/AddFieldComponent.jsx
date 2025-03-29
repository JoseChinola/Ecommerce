import React from 'react'
import { IoClose } from 'react-icons/io5'

const AddFieldComponent = ({ close, value, onChange, submit }) => {
    return (
        <section className='fixed top-0 bottom-0 right-0 left-0 bg-neutral-900 
        bg-opacity-70 z-50 flex justify-center items-center p-4'>
            <div className='bg-white rounded p-4 w-full max-w-md'>
                <div className='flex items-center justify-between bg-blue-50 p-2 rounded-md'>
                    <h1 className='font-semibold uppercase italic'>Add Sub Category</h1>
                    <button onClick={close} className='w-fit block ml-auto hover:text-red-600'>
                        <IoClose size={30} />
                    </button>
                </div>

                <input
                    className='bg-blue-50 my-3 p-2 border outline-none focus-within:border-primary-Green rounded w-full'
                    placeholder='Enter Field name'
                    value={value}
                    onChange={onChange}
                />
                <button
                    onClick={submit}
                    className='bg-primary-Green text-white hover:bg-white
                     hover:text-primary-Green px-4 py-1.5
                      rounded-md mx-auto w-fit block ml-auto
                      border border-primary-Green
                      '
                >
                    Add Field
                </button>
            </div>
        </section>
    )
}

export default AddFieldComponent