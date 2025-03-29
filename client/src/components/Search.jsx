import React, { useEffect, useState } from 'react'
import { IoSearchSharp } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from '../hooks/useMobile';

const Search = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isSearchPage, setIsSearchPage] = useState(false)
    const [isMobile] = useMobile()


    useEffect(() => {
        const isSearch = location.pathname === "/search"
        setIsSearchPage(isSearch)

    }, [location])

    const redirectToSearchPage = () => {
        navigate("/search")
    }


    return (
        <div className='w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-green-500'>
            <div>

                {
                    (isMobile && isSearchPage) ? (
                        <Link to={"/"} className='flex justify-center items-center h-full p-2 group-focus-within:text-green-500 bg-white rounded-full shadow-sm'>
                            <FaArrowLeft size={22} />
                        </Link>
                    ) : (
                        <button onClick={redirectToSearchPage} className='flex justify-center items-center h-full p-3 group-focus-within:text-green-500'>
                            <IoSearchSharp size={22} />
                        </button>
                    )
                }
            </div>
            <div className='w-full h-full'>
                {
                    !isSearchPage ? (
                        //Not in search page
                        <div onClick={redirectToSearchPage} className='w-full h-full flex items-center'>
                            <TypeAnimation
                                sequence={[
                                    // Same substring at the start will only be typed out once, initially
                                    'Search "home"',
                                    1000,
                                    'Search "skin care"',
                                    1000,
                                    'Search "make-up"',
                                    1000,
                                    'Search "furniture"',
                                    1000,
                                    'Search "belts"',
                                    1000,
                                    'Search "men´s clothing"',
                                    1000,
                                    'Search "women´s clothing"',
                                    1000,
                                    'Search "sports"',
                                    1000,
                                    'Search "cumputers"',
                                    1000,
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                            />
                        </div>
                    ) : (
                        //when i was search
                        <div className='w-full h-full'>
                            <input
                                type='text'
                                placeholder='Search for atta dal and more.'
                                autoFocus
                                className='bg-transparent w-full h-full outline-none'
                            />
                        </div>
                    )
                }
            </div>

        </div>
    )
}

export default Search