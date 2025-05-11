import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { validaURLConvert } from '../utils/validaURLConvert'
import { Link, useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import Carousel from '../components/CarouselImg'
import Axios from '../utils/Axios'
import SummaryApi from '../cammon/SummaryApi'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const prevCategoryIdsRef = useRef([])
  const navigate = useNavigate()

  const [categoriesWithProductsList, setCategoriesWithProductsList] = useState([])

  useEffect(() => {
    if (loadingCategory || categoryData.length === 0) return

    // Guardamos último ID list
    const currentIds = categoryData.map(c => c._id).join(',')
    if (prevCategoryIdsRef.current === currentIds) {
      return // No hacemos nada si no cambió
    }
    prevCategoryIdsRef.current = currentIds

    const controller = new AbortController()

    const loadCategoriesWithProducts = async () => {
      try {
        // Petición única con todos los IDs de las categorías
        const res = await Axios({
          ...SummaryApi.getProductByCategory,
          data: { id: categoryData.map(c => c._id) },
          signal: controller.signal
        })

        if (res.data.success) {
          // Filtra solo las categorías con productos
          const categoriesWithProducts = res.data.data.filter(category => category.products.length > 0)
          setCategoriesWithProductsList(categoriesWithProducts)
        }
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error("Error cargando categorías con productos", err)
        }
      }
    }

    loadCategoriesWithProducts()

    return () => controller.abort()
  }, [loadingCategory, categoryData])

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find(sub => sub.categoryData && sub.categoryData._id === id)
    if (!subcategory) return
    const url = `/${validaURLConvert(cat)}-${id}/${validaURLConvert(subcategory.name)}-${subcategory._id}`
    navigate(url)
  }

  return (
    <section className='bg-white rounded-lg'>
      <div className='container mx-auto rounded my-4 px-2 py-2'>
        {/* Banner container */}
        <div className='w-full h-full grid items-center border bg-white gap-2 p-2 rounded-md'>
          <p className='font-semibold lg:text-xl italic px-4 py-2'>Ofertas hasta <span className='text-white bg-red-500 rounded-full w-fit text-center px-2'>-5%</span></p>
          <Carousel />
        </div>

        <div className='mt-4'>
          <h2 className='font-extrabold uppercase italic px-4 text-blue-500 bg-blue-100 py-2 rounded-md'>Category</h2>

          <div className='container mx-auto px-2 py-4 flex flex-wrap gap-4'>
            {
              loadingCategory ? (
                new Array(12).fill(null).map((_, index) => (
                  <div key={index} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                    <div className='bg-blue-100 min-h-24 rounded'></div>
                    <div className='bg-blue-100 h-8 rounded'></div>
                  </div>
                ))
              ) : (
                categoryData.map((cat, index) => (
                  <Link
                    key={cat._id + "displayCategory" + index}
                    className='flex justify-center items-center cursor-pointer'
                    onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                  >
                    <div className='w-full h-full border border-neutral-300 bg-transparent flex flex-col items-center rounded-lg shadow-md'>
                      <div className='w-full h-32 overflow-hidden'>
                        <img
                          src={cat?.image}
                          className='w-full h-full object-contain'
                          alt={cat?.name}
                        />
                      </div>
                      <h6 className='text-xs text-center bg-blue-100 py-1 px-1 text-blue-500 font-bold w-full overflow-hidden text-ellipsis whitespace-nowrap'>
                        {cat?.name}
                      </h6>
                    </div>
                  </Link>
                ))
              )
            }
          </div>
        </div>

        {/* Display category products */}
        {categoriesWithProductsList.length > 0 && categoriesWithProductsList.map((cat, idx) => (
          <CategoryWiseProductDisplay
            key={cat.category._id + idx}
            id={cat.category._id}
            name={cat.category.name}
            products={cat.products}
          />
        ))}
      </div>
    </section>
  )
}

export default Home