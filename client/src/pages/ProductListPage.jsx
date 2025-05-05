import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../cammon/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { validaURLConvert } from '../utils/validaURLConvert'
import CardProduct from '../components/CardProduct'
import CardLoading from './CardLoading'
import SkeletonSubCategory from '../components/SkeletonSubCategory'

const ProductListPage = () => {
    const params = useParams()
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalCount, setTotalCount] = useState(1)

    const allSubCategories = useSelector(state => state.product.allSubCategory)
    const [filteredSubCategories, setFilteredSubCategories] = useState([])

    const getLastFiveParts = (str) => str?.split('-')?.slice(-5)?.join('-') || null
    const getNameFromSlug = (str) => str?.split('-')?.slice(0, -5)?.join(' ') || null

    const categoryId = getLastFiveParts(params?.category)
    const subCategoryId = getLastFiveParts(params?.subCategory)
    const categoryName = getNameFromSlug(params?.category)
    const subCategoryName = getNameFromSlug(params?.subCategory)

    const fetchProductData = async () => {
        try {
            setLoading(true)

            const response = await Axios({
                ...SummaryApi.getProductByCategoryAndSubCategory,
                data: {
                    categoryId,
                    subCategoryId,
                    page,
                    limit: 8
                }
            })

            const { data: resData } = response
            if (resData.success) {
                setProducts(page === 1 ? resData.data : [...products, ...resData.data])
                setTotalCount(resData.data.totalCount)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setPage(1)
        fetchProductData()
    }, [params])

    useEffect(() => {
        const subCategories = allSubCategories.filter(s => s.category === categoryId)
        setFilteredSubCategories(subCategories)
    }, [allSubCategories, categoryId])

    return (
        <section className=''>
            <div className='container mx-auto grid grid-cols-[100px,1fr] lg:grid-cols-[250px,1fr] gap-2'>
                {/* Subcategory Menu */}
                <aside className='bg-white rounded-lg shadow-md py-4 lg:min-h-[78vh] lg:max-h-[78vh] lg:overflow-y-scroll scrollbarCustom'>
                    <div className='shadow-md p-2 rounded-md'>
                        <h3 className='font-semibold text-center capitalize'>{categoryName}</h3>
                    </div>

                    <div className='grid gap-2'>
                        {loading ? (
                            Array.from({ length: 6 }, (_, i) => <SkeletonSubCategory key={i} />)
                        ) : (
                            filteredSubCategories.map((sub, index) => {
                                const link = `/${validaURLConvert(sub?.categoryData?.name)}-${sub?.category}/${validaURLConvert(sub.name)}-${sub._id}`
                                const isActive = subCategoryId === sub._id

                                return (
                                    <Link
                                        key={sub._id + "displayProduct" + index}
                                        to={link}
                                        className={`w-full p-2 rounded-lg flex items-center justify-center md:justify-start gap-3 shadow-md cursor-pointer ${isActive ? "bg-green-500 text-white" : "hover:bg-green-100"
                                            }`}
                                    >
                                        <img
                                            src={sub.image}
                                            alt='Subcategory'
                                            className='sm:w-14 sm:h-14 w-full h-full object-scale-down rounded-lg'
                                        />
                                        <p className='text-sm lg:text-base hidden md:block line-clamp-2'>{sub.name}</p>
                                    </Link>
                                )
                            })
                        )}
                    </div>
                </aside>

                {/* Products List */}
                <main className='w-full'>
                    <div className='bg-white shadow-md m-1 p-2 rounded-md text-primary-Green'>
                        <h3 className='font-semibold capitalize'>{subCategoryName}</h3>
                    </div>

                    <div className='mt-1'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 p-2 gap-4'>
                            {loading ? (
                                Array.from({ length: 8 }, (_, i) => <CardLoading key={i} />)
                            ) : (
                                products.map((p, index) => (
                                    <CardProduct data={p} key={p._id + "productSubCategory" + index} />
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </section>

    )
}

export default ProductListPage