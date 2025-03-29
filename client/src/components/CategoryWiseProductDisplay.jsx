import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../cammon/SummaryApi'
import CardLoading from '../pages/CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { validaURLConvert } from '../utils/validaURLConvert'
import { useSelector } from 'react-redux'



const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const loadingCardNumer = new Array(6).fill(null)
    const subCategoryData = useSelector(state => state.product.allSubCategory)


    const fetChCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const res = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
                }
            })

            const { data: resData } = res
            if (resData.success) {
                setData(resData.data)
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetChCategoryWiseProduct()
    }, [])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 200
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 200
    }


    const handleRedirectProductListpage = () => {

        const subcategory = subCategoryData.find(sub => {
            return sub.categoryData && sub.categoryData._id === id;
        });

        if (!subcategory) {
            return "/";
        }
        return `/${validaURLConvert(name)}-${id}/${validaURLConvert(subcategory.name || "default")}-${subcategory._id}`;
    };


    return (
        <div className='shadow-md'>
            <div className='container mx-auto p-3 flex items-center justify-between gap-4'>
                <h3 className='font-semibold text-lg md:text-xl'>{name}</h3>
                <Link to={handleRedirectProductListpage()} className='text-green-600 hover:text-primary-Green'>See All</Link>
            </div>
            <div className='relative flex items-center'>
                <div className='flex items-center gap-4 md:gap-6 lg:m-7 container mx-auto px-4 overflow-x-scroll scrollbar-none overflow-hidden scroll-smooth' ref={containerRef}>
                    {loading &&
                        loadingCardNumer.map((_, index) => {
                            return (
                                <CardLoading key={"CategorywiseProducDisplay12" + index} />
                            )
                        })
                    }
                    {
                        data.map((p, index) => {
                            return (
                                <CardProduct data={p} key={p._id + "CategorywiseProducDisplay" + index} />
                            )
                        })
                    }

                </div>
                <div className='w-full left-0 right-0 container mx-auto px-2 absolute hidden lg:flex justify-between'>
                    <button onClick={handleScrollLeft} className='z-10 relative bg-white hover:bg-gray-200 hover:text-primary-Green shadow-lg p-2 rounded-full text-lg '>
                        <FaAngleLeft size={20} />
                    </button>
                    <button onClick={handleScrollRight} className='z-10 relative bg-white hover:bg-gray-200 hover:text-primary-Green shadow-lg p-2 rounded-full text-lg '>
                        <FaAngleRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CategoryWiseProductDisplay