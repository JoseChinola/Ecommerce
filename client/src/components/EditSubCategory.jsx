import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import UploadImage from '../utils/UploadImage'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import SummaryApi from '../cammon/SummaryApi'
import Axios from '../utils/Axios'
import { useSelector } from 'react-redux'
import { FaCamera } from 'react-icons/fa'

const EditSubCategory = ({ close, data, fetchData }) => {
    const [subCategoryData, setSubCategoryData] = useState({
        _id: data._id,
        name: data.name || "",
        image: data.image || "",
        category: Array.isArray(data.categoryData)
            ? data.categoryData
            : data.categoryData
                ? [data.categoryData]
                : []
    });


    const [loading, setLoading] = useState(false)
    const allCategory = useSelector(state => state.product.allCategory);

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const res = await Axios({
                ...SummaryApi.updateSubCategory,
                data: subCategoryData
            })

            const { data: resData } = res
            if (resData.success) {
                toast.success(resData.message)
                if (close) {
                    close()
                }
                if (fetchData) {
                    fetchData()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }

    }

    const handleOnchage = (e) => {
        const { name, value } = e.target

        setSubCategoryData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleUploadSubCategoryImage = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        const response = await UploadImage(file)
        const { data: ImageResponse } = response
        setSubCategoryData((prev) => {
            return {
                ...prev,
                image: ImageResponse.data.url
            }
        })
    }

    const handleRemoveCategorySelected = (categoryId) => {
        setSubCategoryData((prev) => ({
            ...prev,
            category: prev.category.filter((el) => el._id !== categoryId)
        }))
    }

    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 p-2 rounded z-50 bg-neutral-800 bg-opacity-70 flex items-center justify-center'>
            <div className='bg-white rounded-md max-w-4xl w-full  p-6'>

                <div className='flex items-center justify-between bg-blue-50 p-2 rounded-md'>
                    <h1 className='font-semibold uppercase italic'>Edit Sub Category</h1>
                    <button onClick={close} className='w-fit block ml-auto hover:text-red-600'>
                        <IoClose size={30} />
                    </button>
                </div>


                <form className='my-3 grid gap-2' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label className='italic' htmlFor="name">
                            Name
                        </label>
                        <input
                            type='text'
                            id='categoryName'
                            placeholder='Enter your name'
                            value={subCategoryData.name}
                            name='name'
                            onChange={handleOnchage}
                            className='bg-blue-50 p-2 outline-none border-2 border-blue-100
                                    focus-within:border-green-500 rounded-md'
                        />
                    </div>

                    <div className='grid gap-2'>
                        <label className='italic' htmlFor="image">
                            Image
                        </label>
                        <div className='flex gap-4 flex-col lg:flex-row items-center'>

                            <div className='border bg-blue-50 rounded w-full h-36 lg:w-36 flex
                                                       items-center justify-center'>
                                {
                                    subCategoryData.image ? (
                                        <img
                                            alt='category'
                                            src={subCategoryData.image}
                                            className='w-full h-full object-cover rounded'

                                        />
                                    ) : (
                                        <p className='text-sm text-neutral-500'>No Image</p>

                                    )
                                }
                            </div>

                            <label htmlFor="uploadSubCategoryImage">
                                <div className={`
                                           ${!subCategoryData.name ? "bg-gray-400 text-white " : "cursor-pointer border border-green-600 hover:bg-primary-Green hover:text-white"}
                                           flex items-center justify-center gap-2 text-green-500  rounded-md px-5 py-2 select-none 
                                           `}>
                                    <FaCamera size={20} /> Upload
                                </div>
                                <input
                                    disabled={!subCategoryData.name}
                                    onChange={handleUploadSubCategoryImage}
                                    type='file'
                                    id='uploadSubCategoryImage'
                                    className='hidden'
                                />
                            </label>
                        </div>
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="">Select Category</label>
                        <div className='border focus-within:border-primary-Green rounded-md'>
                            <div className='bg-blue-50 flex flex-wrap'>
                                {subCategoryData.category.map((cat) => (
                                    <p key={cat._id + "selectedValue"} className='bg-white shadow-md rounded px-1 m-2 flex items-center gap-2'>
                                        {cat.name}  {/* Mostrar el nombre de la categoría */}
                                        <button className='cursor-pointer hover:text-red-600 select-none' onClick={() => handleRemoveCategorySelected(cat._id)}>
                                            <IoClose size={20} />
                                        </button>
                                    </p>
                                ))}
                            </div>

                            <select
                                className='w-full bg-transparent border p-2 rounded-md outline-none'
                                onChange={(e) => {
                                    const value = e.target.value
                                    const categoryDetails = allCategory.find(el => el._id === value)
                                    setSubCategoryData((preve) => {
                                        return {
                                            ...preve,
                                            category: [...preve.category, categoryDetails]
                                        }
                                    })

                                }}
                            >
                                <option value="">Select Category</option>
                                {
                                    allCategory.map((category, index) => {
                                        return (
                                            <option className='px-2' value={category?._id}
                                                key={category._id + "subcategory"}
                                            >{category?.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>


                    <button className={`
                               ${subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0] ? "bg-green-600 text-neutral-200 hover:bg-green-500 hover:text-white" : "bg-gray-300"} 
                               py-2 font-semibold rounded-md mt-4
                               `}
                    >
                        {loading ? "Loading..." : "Update Subcategory"}
                    </button>
                </form>
            </div>
        </section>
    )
}

export default EditSubCategory