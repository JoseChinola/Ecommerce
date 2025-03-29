import React from 'react'
import { IoClose } from "react-icons/io5";


const ConfirmBox = ({ cancel, confirm, close }) => {
    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 z-50 bg-neutral-800 bg-opacity-70 p-4 flex items-center justify-center'>
            <div className='bg-white w-full max-w-md rounded-md p-4'>
                <div className='flex items-center justify-between bg-blue-50 p-2 rounded-md select-none'>
                    <h1 className='font-semibold capitalize tracking-wide'>Confirm Delete </h1>
                    <button onClick={close} className='w-fit block ml-auto hover:text-red-600'>
                        <IoClose size={30} />
                    </button>
                </div>

                <div className='bg-blue-50 p-3 mt-2 rounded-md'>
                    <p className='my-3'>Are you sure permanent delete ?</p>
                    <div className='w-fit ml-auto flex items-center gap-4'>
                        <button onClick={cancel} className='px-3 py-1 select-none
                         border rounded border-red-500 text-red-500 hover:bg-red-500 hover:text-white'>
                            Cancel
                        </button>
                        <button onClick={confirm} className='px-3 py-1 select-none
                         border rounded-md border-green-500 text-green-500 hover:bg-green-500 hover:text-white'>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmBox