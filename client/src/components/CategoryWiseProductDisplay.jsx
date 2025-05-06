import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import CardLoading from '../pages/CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"
import { validaURLConvert } from '../utils/validaURLConvert'
import { useSelector } from 'react-redux'

const CategoryWiseProductDisplay = ({ id, name, products }) => {
  const containerRef = useRef()
  const subCategoryData = useSelector(state => state.product.allSubCategory)

  const handleRedirect = () => {
    const sub = subCategoryData.find(s => s.categoryData && s.categoryData._id === id)
    if (!sub) return "/"
    return `/${validaURLConvert(name)}-${id}/${validaURLConvert(sub.name)}-${sub._id}`
  }

  const scroll = dir => {
    containerRef.current.scrollLeft += dir * 200
  }
  

  return (
    <div className='shadow-md p-4 my-6'>
      <div className='flex justify-between items-center p-3 rounded-lg bg-secundary'>
        <h3 className='font-bold text-primary-Green'>{name}</h3>
        <Link to={handleRedirect()} className='font-bold hover:text-green-600 text-primary-Green'>
          Ver todo
        </Link>
      </div>
      <div className='relative mt-2'>
        <div
          ref={containerRef}
          className='flex gap-2 overflow-x-auto scrollbar-none scroll-smooth p-2'
        >
          {products.length === 0 ? (
            <div className='flex-none w-full sm:w-auto'>
              <CardLoading />
            </div>
          ) : (
            products.map(p => (
              <div key={p._id} className='flex-none w-full sm:w-auto'>
                <CardProduct data={p} />
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => scroll(-1)}
          className='absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow '
        >
          <FaAngleLeft />
        </button>
        <button
          onClick={() => scroll(1)}
          className='absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow '
        >
          <FaAngleRight />
        </button>
      </div>
    </div>
  )
}

export default CategoryWiseProductDisplay
