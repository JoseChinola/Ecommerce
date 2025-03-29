import React from 'react'
import bannerDesktp from '../assets/banner-desk.jpg'
import bannerMobie from '../assets/banner-mobile.png'
import { useSelector } from 'react-redux'
import { validaURLConvert } from '../utils/validaURLConvert'
import { Link, useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'



const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()


  const handleRedirectProductListpage = (id, cat) => {
    console.log(id, cat)
    const subcategory = subCategoryData.find(sub => {
      return sub.categoryData && sub.categoryData._id === id;
    })
    const url = `/${validaURLConvert(cat)}-${id}/${validaURLConvert(subcategory.name)}-${subcategory._id}`;
    navigate(url)
  }



  return (
    <section className='bg-white rounded'>
      <div className='container mx-auto rounded my-4 px-3'>
        {/* Banner container */}
        <div className={`w-full h-56 min-h-48 bg-white rounded-md ${!bannerDesktp && "animate-pulse my-2"} p-2`}>
          <img
            src={bannerDesktp}
            alt="banner"
            className='w-full h-full object-cover rounded hidden lg:block'
          />

          <img
            src={bannerMobie}
            alt="banner"
            className='w-full h-full object-cover rounded lg:hidden'
          />
        </div>


        <div className='container mx-auto px-4 py-4 my-4 grid grid-cols-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4'>
          {
            loadingCategory ? (
              new Array(12).fill(null).map((c, index) => {
                return (
                  <div key={index + "loadingcategory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                    <div className='bg-blue-100 min-h-24 rounded'></div>
                    <div className='bg-blue-100 h-8 rounded'></div>
                  </div>
                )
              })
            ) : (
              categoryData.map((cat, index) => {
                return (
                  <Link
                    key={cat._id + "displayCategory" + index}
                    className="w-full h-full flex justify-center items-center cursor-pointer"
                    onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                  >
                    <div className=" md:w-[200px] md:h-[175px] w-full h-full border border-neutral-300 bg-transparent flex flex-col items-center rounded-lg shadow-md">
                      {/* Contenedor de la imagen */}
                      <div className="w-full h-full overflow-hidden">
                        <img
                          src={cat?.image}
                          className="w-full h-full object-cover rounded"
                          alt={cat?.name}
                        />
                      </div>

                      {/* Contenedor del texto */}
                      <div className="bg-blue-100 h-8 w-full my-2 hidden lg:flex justify-center items-center">
                        <h6 className="text-sm text-center text-blue-500 font-bold w-full container 
                                     overflow-hidden text-ellipsis whitespace-nowrap ">
                          {cat?.name}
                        </h6>
                      </div>
                    </div>
                  </Link>

                )
              })

            )

          }
        </div>
      </div>


      {/* display category product */}
      {
        categoryData.map((c, index) => {
          return (
            <CategoryWiseProductDisplay key={c?._id + "CategorywiseProduct" + index}
              id={c?._id}
              name={c?.name} />
          )
        })
      }
    </section>
  )
}

export default Home