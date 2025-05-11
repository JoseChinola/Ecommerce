import React, { useEffect, useState } from 'react'
import SummaryApi from '../cammon/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import NoData from '../components/NoData'
import UploadProductPage from './UploadProductPage'
import { FaPlus } from 'react-icons/fa6'

const ProductAdmin = () => {
    const [productData, setProductData] = useState([])
    const [openAddProducto, setOpenAddProducto] = useState(false);
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalPageCount, setTotalPageCount] = useState(1)
    const [totalProducts, setTotalProducts] = useState(0);
    const [search, setSearch] = useState("")

    const fetchProductData = async () => {
        try {
            setLoading(true)
            const resp = await Axios({
                ...SummaryApi.getProduct,
                data: {
                    page: page,
                    limit: 10,
                    search: search
                }
            })
            const { data: resData } = resp
            if (resData.success && resData.data) {
                setProductData(resData.data);
                setTotalPageCount(resData.totalNoPage || 1);
                setTotalProducts(resData.totalCount);
            } else {
                setProductData([]);
                setTotalPageCount(1);
                setTotalProducts(0);
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
        setPage(1);
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
                <div className='py-3 px-4 w-full rounded-lg font-semibold bg-secundary shadow-md flex items-center justify-between flex-col md:flex-row gap-3'>
                    <h2 className='font-extrabold uppercase text-primary-Green'>Mantenimiento Productos</h2>

                    <div className='h-full w-full sm:max-w-xs md:max-w-md bg-white px-3 flex items-center gap-2 py-2 rounded-md border focus-within:border-primary-Green'>
                        <IoSearchOutline size={23} />
                        <input
                            type="text"
                            placeholder='Buscar producto...'
                            className='h-full w-full bg-transparent outline-none'
                            value={search}
                            onChange={handleOnChange}
                        />
                    </div>

                    <button
                        onClick={() => setOpenAddProducto(true)}
                        className="text-[#0aa86f] border border-[#0aa86f] bg-white px-4 py-2 rounded-lg hover:bg-[#0aa86f] hover:text-white flex items-center gap-2 w-full sm:w-auto"
                    >
                        <FaPlus /> Añadir Productos
                    </button>
                </div>

                <div className='px-2 py-3 lg:p-2 mt-3 rounded-md bg-secundary space-y-2'>
                    <p className="text-lg text-end font-bold text-primary-Green">
                        Total de Productos: {totalProducts}
                    </p>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                        {loading ? (
                            Array.from({ length: 12 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="animate-pulse bg-white shadow-lg rounded-lg p-6"
                                >
                                    <div className="bg-gray-300 h-32 w-full rounded mb-4"></div>
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
                        <div className='flex justify-between items-center bg-white py-2 px-2 rounded-lg'>
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

            {openAddProducto && (
                <UploadProductPage onClose={() => setOpenAddProducto(false)} fetchProductData={fetchProductData} />
            )}
        </section>
    )
}

export default ProductAdmin
