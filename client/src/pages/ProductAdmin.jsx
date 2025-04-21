import React, { useEffect, useState } from 'react'
import SummaryApi from '../cammon/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";


const ProductAdmin = () => {
    const [productData, setProductData] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalPageCount, setTotalPageCount] = useState(1)
    const [search, setSearch] = useState("")


    const fetchProductData = async () => {
        try {
            setLoading(true)
            const resp = await Axios({
                ...SummaryApi.getProduct,
                data: {
                    page: 1,
                    limit: 12,
                    search: search
                }
            })

            const { data: resData } = resp
           
            if (resData.success) {
                setProductData(resData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProductData()
    }, [page])

    const handleNext = () => {
        setPage(prev => Math.min(prev + 1, totalPageCount));
    };

    const handlePrevious = () => {
        if (page > 1) {
            setPage(preve => preve - 1)
        }
    }

    const handleOnChange = (e) => {
        const { value } = e.target;
        setSearch(value);
        setPage(1); // Resetear página a la 1 cada vez que se realiza una nueva búsqueda
    }

    useEffect(() => {
        let flag = true
        const interval = setTimeout(() => {
            if (flag) {
                fetchProductData()
                flag = false
            }
        }, 300);

        return () => {
            clearTimeout(interval)
        }
    }, [search])

    return (
        <section className='p-3'>
            <div className='p-4 bg-white rounded-lg grid m-auto shadow-lg'>
                <div className='py-4 px-4 w-full rounded-md font-semibold bg-blue-50 shadow-md flex items-center justify-between'>
                    <h2 className='font-extrabold uppercase text-primary-Green'>Product</h2>
                    <div className='h-full w-full min-w-24 max-w-52 bg-white px-3 flex items-center gap-2 py-2 rounded-md border focus-within:border-primary-Green'>
                        <IoSearchOutline size={23} />
                        <input
                            type="text"
                            placeholder='Search product here...'
                            className='h-full w-full bg-transparent outline-none'
                            value={search}
                            onChange={handleOnChange}
                        />
                    </div>
                </div>
                {
                    loading && (
                        <div className='p-8'>
                            <Loading />
                        </div>
                    )
                }

                <div className='px-2 py-3 lg:p-5 mt-3 rounded-md bg-blue-50'>
                    <div className='min-h-[55vh]'>
                        <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
                            {
                                productData.map((p, index) => {
                                    return (
                                        <ProductCardAdmin fetchData={fetchProductData} data={p} key={p._id + index + "productAdmin"} />
                                    )
                                })
                            }
                        </div>

                    </div>
                    <div className='flex justify-between items-center my-4'>
                        <button onClick={handlePrevious} className='border border-primary-Green bg-gray-50 px-4 text-primary-Green rounded-md hover:bg-primary-Green hover:text-white select-none'>
                            <MdNavigateBefore size={25} />
                        </button>
                        <p className='text-base font-semibold'>
                            {page}/{totalPageCount}
                        </p>
                        <button onClick={handleNext} className='border border-primary-Green bg-gray-50 px-4 text-primary-Green rounded-md hover:bg-primary-Green hover:text-white select-none'>
                            <MdNavigateNext size={25} />
                        </button>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductAdmin
