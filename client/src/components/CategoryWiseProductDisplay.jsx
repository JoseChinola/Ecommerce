import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../cammon/SummaryApi'
import CardLoading from '../pages/CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"
import { validaURLConvert } from '../utils/validaURLConvert'
import { useSelector } from 'react-redux'

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef()
  const loadingCards = Array.from({ length: 6 })

  const subCategoryData = useSelector(state => state.product.allSubCategory)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await Axios({
          ...SummaryApi.getProductByCategory,
          data: { id }
        })
        if (res.data.success) {
          setData(res.data.data)
        }
      } catch (err) {
        AxiosToastError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

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
          {loading
            ? loadingCards.map((_, i) => (
              <div key={i} className='flex-none w-full sm:w-auto'>
                <CardLoading />
              </div>
            ))
            : data.map(p => (
              <div key={p._id} className='flex-none w-full sm:w-auto'>
                <CardProduct data={p} />
              </div>
            ))
          }
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
