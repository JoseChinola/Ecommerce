import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'


const Dashboard = () => {
   
    return (
        <section className='bg-white'>
            <div className="container mx-auto mt-1 grid lg:grid-cols-[230px,1fr] ">
                { /** left for menu */}
                <div className='py-5 px-2 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r'>
                    <UserMenu />
                </div>

                { /**menu */}
                <div className='bg-white min-h-[78vh]'>
                    <Outlet />
                </div>
            </div>
        </section>
    )
}

export default Dashboard