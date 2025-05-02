import React from 'react'
import { IoClose } from 'react-icons/io5'

const ViewImage = ({ url, close }) => {
    return (
        <div className='fixed top-0 z-50 bottom-0 right-0 left-0 bg-neutral-900 bg-opacity-70 flex justify-center items-center p-4'>
            <div className='w-full max-w-sm max-h-[80hv] p-4 bg-white rounded-md'>
                <button className='w-fit ml-auto block' onClick={close} >
                    <IoClose size={30} />
                </button>
                <div className='w-[350px] h-[250px] max-w-full max-h-full overflow-hidden rounded-md'>
                    <img
                        src={url}
                        alt="Full screen"
                        className='w-full h-full object-cover aspect-square'
                    />
                </div>
            </div>
        </div>
    )
}

export default ViewImage