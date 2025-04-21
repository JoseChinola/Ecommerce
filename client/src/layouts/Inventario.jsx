import React from 'react'
import { MdWarehouse } from 'react-icons/md'
import { PiWarehouseFill } from 'react-icons/pi'

const Inventario = () => {
    return (
        <section className='bg-white p-4 rounded-lg'>
            <div className='bg-blue-50 py-1 px-3 w-fit rounded-lg '>
                <h1 className='text-primary-Green text-2xl font-extralight italic flex items-center gap-3'>
                    Inventory
                    <PiWarehouseFill size={25} className='text-primary-Green' />
                </h1>
            </div>

            <div className='p-4 my-4 bg-blue-50 rounded-lg'>
                <p className='text-primary-Green'>datos para el almancen o inventario</p>
            </div>
        </section>
    )
}

export default Inventario