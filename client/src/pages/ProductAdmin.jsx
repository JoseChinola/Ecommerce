import React, { useEffect, useState } from 'react'
import SummaryApi from '../cammon/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import NoData from '../components/NoData'


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
                    page: page,
                    limit: 12,
                    search: search
                }
            })

            const { data: resData } = resp

            console.log(resData)
            if (resData.success && resData.data?.products) {
                setProductData(resData.data.products);
                setTotalPageCount(resData.data.totalPages || 1);
            } else {
                setProductData([]); // Para evitar errores en el map
                setTotalPageCount(1);
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
                <div className='py-3 px-4 w-full rounded-md font-semibold bg-secundary shadow-md flex items-center justify-between'>
                    <h2 className='font-extrabold uppercase text-primary-Green'>Productos</h2>
                    <div className='h-full w-full min-w-24 max-w-52 bg-white px-3 flex items-center gap-2 py-2 rounded-md border focus-within:border-primary-Green'>
                        <IoSearchOutline size={23} />
                        <input
                            type="text"
                            placeholder='Buscar product...'
                            className='h-full w-full bg-transparent outline-none'
                            value={search}
                            onChange={handleOnChange}
                        />
                    </div>
                </div>

                <div className='px-2 py-3 lg:p-5 mt-3 rounded-md bg-secundary'>
                    <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
                        {loading ? (
                            Array.from({ length: 12 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="animate-pulse bg-white shadow rounded-lg p-4 h-[200px]"
                                >
                                    <div className="bg-gray-300 h-24 w-full rounded mb-4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                </div>
                            ))
                        ) : productData.length > 0 ? (
                            productData.map((p, index) => (
                                <ProductCardAdmin
                                    fetchData={fetchProductData}
                                    data={p}
                                    key={p._id + index + "productAdmin"}
                                />
                            ))
                        ) : (
                            <NoData />
                        )}
                    </div>

                    {totalPageCount > 1 && (
                        <div className='flex justify-between items-center my-4 bg-white py-2 px-2 rounded-lg'>
                            <button onClick={handlePrevious} className='border rounded-full border-primary-Green bg-gray-50 px-2 py-2 text-primary-Green hover:bg-primary-Green hover:text-white select-none'>
                                <MdNavigateBefore />
                            </button>
                            <p className='text-base font-semibold'>
                                {page}/{totalPageCount}
                            </p>
                            <button onClick={handleNext} className='border rounded-full border-primary-Green bg-gray-50 px-2 py-2 text-primary-Green hover:bg-primary-Green hover:text-white select-none'>
                                <MdNavigateNext />
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </section>
    )
}

export default ProductAdmin
