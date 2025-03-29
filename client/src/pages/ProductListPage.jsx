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
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setloading] = useState(false)
    const [totalPage, setTotalPage] = useState(1)
    const AllsubCategory = useSelector(state => state.product.allSubCategory)
    const [DisplaySubCategory, setDisplaySubCategory] = useState([])


    const subCategoryName = params?.subCategory
        ?.split("-") // Dividimos en un array
        .slice(0, -5) // Tomamos todo excepto los últimos 5 elementos (ID)
        .join(" ") || null;

    const CategoryName = params?.category
        ?.split("-") // Dividimos en un array
        .slice(0, -5) // Tomamos todo excepto los últimos 5 elementos (ID)
        .join(" ") || null;


    const categoryParts = params?.category?.split("-");
    const categoryId = categoryParts?.slice(-5).join("-") || null;

    const subCategoryParts = params?.subCategory?.split("-");
    const subCategoryId = subCategoryParts?.slice(-5).join("-") || null;


    const fetchProductData = async () => {


        try {
            setloading(true)

            const response = await Axios({
                ...SummaryApi.getProductByCategoryAndSubCategory,
                data: {
                    categoryId: categoryId,
                    subCategoryId: subCategoryId,
                    page: page,
                    limit: 8
                }
            })

            const { data: resDanta } = response
            if (resDanta.success) {
                if (resDanta.page == 1) {
                    setData(resDanta.data)
                } else {
                    setData([...data, ...resDanta.data])
                }
                setTotalPage(resDanta.data.totalCount)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        fetchProductData()
    }, [params])


    useEffect(() => {
        const sub = AllsubCategory.filter(s => {
            const filterData = s.category === categoryId

            return filterData ? filterData : null
        })
        setDisplaySubCategory(sub)

    }, [params, AllsubCategory])


    return (
        <section className='sticky top-28 lg:top-20'>
            <div className='container sticky top-28 mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[250px,1fr]'>
                {/** Sub category **/}
                <div className='min-h-[78vh] max-h-[78vh] overflow-y-scroll grid gap-2 shadow-md scrollbarCustom bg-white py-4' >

                    <div className='shadow-md p-1 rounded-md'>
                        <h3 className='font-semibold text-center capitalize'>{CategoryName}</h3>
                    </div>

                    {
                        loading ? (
                            // Mostrar 6 Skeletons mientras se cargan las subcategorías
                            Array(6).fill(null).map((_, index) => (
                                <SkeletonSubCategory key={index} />
                            ))
                        ) : (
                            DisplaySubCategory.map((s, index) => {
                                const link = `/${validaURLConvert(s?.categoryData.name)}-${s?.category}/${validaURLConvert(s.name)}-${s._id}`;

                                return (
                                    <Link key={s?._id + "displayProduct" + index} to={link} className={`w-full p-2 rounded lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b
                                            hover:bg-green-100 cursor-pointer
                                            ${subCategoryId === s?._id ? "bg-green-500" : ""}
                                        `}>
                                        <div className='w-fit max-w-28 mx-auto lg:mx-0 rounded box-border'>
                                            <img
                                                src={s?.image}
                                                alt='sub-Category'
                                                className='w-14 lg:h-14 lg:w-12 h-full object-scale-down'
                                            />
                                        </div>
                                        <p className='mt-3 lg:mt-0 text-xs text-center lg:text-left lg:text-base'>{s.name}</p>
                                    </Link>
                                );
                            })
                        )
                    }
                </div>


                {/** Product **/}
                <div className=''>
                    <div className='bg-white shadow-md m-2 p-2 rounded-md text-primary-Green'>
                        <h3 className='font-semibold capitalize'>{subCategoryName}</h3>
                    </div>

                    <div className='mt-3'>
                        <div className='min-h-[69vh] max-h-[68vh] overflow-y-scroll w-full scrollbarCustom '>
                            <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 p-3 gap-4'>
                                {
                                    loading ? (
                                        // Muestra 8 Skeletons cuando los datos aún están cargando
                                        Array(8).fill(null).map((_, index) => (
                                            <CardLoading key={index} />
                                        ))
                                    ) : (
                                        data.map((p, index) => (
                                            <CardProduct data={p} key={p._id + "productSubCategory" + index} />
                                        ))
                                    )
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductListPage