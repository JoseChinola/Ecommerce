import React from 'react'
import { useSelector } from 'react-redux'
import { validaURLConvert } from '../utils/validaURLConvert'
import { Link, useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import Carousel from '../components/CarouselImg'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find(sub => sub.categoryData && sub.categoryData._id === id)
    if (!subcategory) return
    const url = `/${validaURLConvert(cat)}-${id}/${validaURLConvert(subcategory.name)}-${subcategory._id}`
    navigate(url)
  }

  return (
    <section className='bg-white rounded-lg'>
      <div className='container mx-auto rounded my-4 px-3 p-2'>
        {/* Banner container */}
        <div className='w-full h-full grid items-center border bg-white gap-2 p-2 rounded-md'>
          <p className='font-semibold lg:text-xl italic px-4 py-2'>Offers up to <span className='text-white bg-red-500 rounded-full w-fit text-center px-2'>-5%</span></p>
          <Carousel />
        </div>

        <div className='mt-4'>
          <h2 className='font-extrabold uppercase italic px-4 text-blue-500 bg-blue-100 py-2 rounded-md'>Category</h2>

          <div className='container mx-auto px-2 py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-2'>
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
                    className='w-full h-full flex justify-center items-center cursor-pointer'
                    onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                  >
                    <div className='w-full h-full border border-neutral-300 bg-transparent flex flex-col items-center rounded-lg shadow-md'>
                      <div className='w-full h-[100px] overflow-hidden'>
                        <img
                          src={cat?.image}
                          className='w-full h-full object-cover rounded-t-lg'
                          alt={cat?.name}
                        />
                      </div>
                      <h6 className='text-xs text-center bg-blue-100 py-1 px-1 text-blue-500 font-bold w-full overflow-hidden text-ellipsis whitespace-nowrap'>
                        {cat?.name || 'Categoría sin nombre'}
                      </h6>
                    </div>
                  </Link>
                ))
              )
            }
          </div>
        </div>
      </div>

      {/* display category product */}
      {
        categoryData.map((c, index) => (
          <CategoryWiseProductDisplay
            key={c?._id + "CategorywiseProduct" + index}
            id={c?._id}
            name={c?.name}
          />
        ))
      }
    </section>
  )
}

export default Home
