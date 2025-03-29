import React, { useState } from 'react'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import UploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError'
import successAlert from '../utils/SuccessAlert';

const EditProductAdmin = ({ close, data: props, fetchData }) => {
    const [data, setData] = useState({
        _id: props._id,
        name: props.name,
        image: typeof props.image === "string" ? JSON.parse(props.image) : props.image || [],
        categoryId: Array.isArray(props.categoryId) ? props.categoryId : [props.categoryId],  // Siempre como un array
        subCategoryId: Array.isArray(props.subCategoryId) ? props.subCategoryId : [props.subCategoryId],
        unit: props.unit,
        stock: props.stock,
        price: props.price,
        discount: props.discount,
        description: props.description,
        more_details: typeof props.more_details === "string" ? JSON.parse(props.more_details) : props.more_details || {},
    })

    const [imageLoading, setImageLoading] = useState(false)
    const [viewImageURl, setViewImageURL] = useState(false)
    const allCategory = useSelector(state => state.product.allCategory)
    const allSubCategory = useSelector(state => state.product.allSubCategory)
    const [selectCategory, setSelectCategory] = useState("")
    const [selectSubCategory, setSelectSubCategory] = useState("")


    const [openAddField, setOpenAddField] = useState(false)
    const [fieldName, setFieldName] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleUploadImage = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }
        setImageLoading(true)
        const response = await UploadImage(file)
        const { data: ImageResponse } = response
        const imageUrl = ImageResponse.data.url

        setData((prev) => {
            return {
                ...prev,
                image: [...prev.image, imageUrl]
            }
        })

        setImageLoading(false)
    }

    const handleDeleteImage = async (index) => {
        data.image.slice(index, 1)

        setData((prev) => ({
            ...prev,
            image: prev.image.filter((_, i) => i !== index) // Filtra las imágenes, eliminando la que tenga el índice seleccionado
        }));

    }

    const handleRemoveCategorySelected = async (index) => {

        data.categoryId.splice(index, 1)

        setData((prev) => ({
            ...prev
        }));
    }

    const handleRemoveSubCategorySelected = async (index) => {
        data.subCategoryId.splice(index, 1)

        setData((prev) => ({
            ...prev
        }));
    }

    const handleAddField = () => {
        setData((preve) => {
            return {
                ...preve,
                more_details: {
                    ...preve.more_details,
                    [fieldName]: ""
                }
            }
        })

        setFieldName("")
        setOpenAddField(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await Axios({
                ...SummaryApi.updateProductDetails,
                data: data
            })
            const { data: resData } = res
            if (resData.success) {
                successAlert(resData.message)
                if (close) {
                    close()
                }
                if (fetchData) {
                    fetchData()
                }

                setData({
                    name: "",
                    image: [],
                    categoryId: [],
                    subCategoryId: [],
                    unit: "",
                    stock: "",
                    price: "",
                    discount: "",
                    description: "",
                    more_details: {},
                })

            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='fixed top-0 left-0 right-0 bottom-0 bg-neutral-800 z-50 bg-opacity-70 p-4'>
            <div className='bg-white w-full p-4 mx-auto max-w-2xl rounded overflow-y-auto h-full max-h-[95vh] scrollbarCustom' >
                <section className=''>
                    <div className='lg:p-4 px-2 py-3 bg-white border rounded-lg max-w-4xl lg:grid m-auto '>

                        <div className="py-2 px-4 max-w-full lg:max-w-3xl w-full rounded-md font-semibold bg-blue-50 shadow-md flex items-center justify-between">
                            <h2 className="font-extrabold uppercase text-sm lg:text-base text-primary-Green">Upload Product</h2>
                            <button onClick={close} className="">
                                <IoClose size={25} />
                            </button>
                        </div>

                        <div className='flex p-4 items-center justify-center w-full'>
                            <form className='grid gap-4 w-full max-w-3xl items-center' onSubmit={handleSubmit}>
                                <div className='grid gap-1'>
                                    <label htmlFor="name" className='font-medium'>Name</label>

                                    <input type="text"
                                        id='name'
                                        placeholder='Enter product name'
                                        name='name'
                                        value={data.name}
                                        onChange={handleChange}
                                        className='bg-blue-50 p-2 outline-none border border-blue-200 focus-within:border-primary-Green rounded-md'
                                        required
                                    />
                                </div>

                                <div className='grid gap-1'>
                                    <label htmlFor="description" className='font-medium'>Description</label>

                                    <textarea type="text"
                                        id='description'
                                        placeholder='Enter product description'
                                        name='description'
                                        value={data.description}
                                        onChange={handleChange}
                                        className='bg-blue-50 p-2 outline-none border border-blue-200 focus-within:border-primary-Green rounded-md resize-none'
                                        multiple
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div>
                                    <p className='font-medium'>Image </p>
                                    <div>
                                        {/* Upload button */}
                                        <label
                                            htmlFor="productImage"
                                            className="bg-blue-50 h-24 border rounded-md border-blue-200 flex items-center justify-center cursor-pointer"
                                        >
                                            <div className="flex justify-center items-center flex-col">
                                                {imageLoading ? <Loading /> : (
                                                    <>
                                                        <FaCloudUploadAlt size={35} />
                                                        <p>Upload Image</p>
                                                    </>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                id="productImage"
                                                className="hidden"
                                                onChange={handleUploadImage}
                                                accept="image/*"
                                            />
                                        </label>
                                        {/* Display uploaded images */}
                                        {Array.isArray(data.image) && data.image.length > 0 && (
                                            <div className="px-4 gap-2 h-24  bg-opacity-40 rounded-lg flex items-center">
                                                {data.image.map((img, index) => (
                                                    <div key={index} className="h-20 w-20 rounded-sm min-w-20 bg-blue-50 relative group">
                                                        <img
                                                            src={img}
                                                            alt={`Image ${index}`}
                                                            className="w-full h-full object-scale-down cursor-pointer p-1 "
                                                            onClick={() => setViewImageURL(img)}
                                                        />
                                                        <div
                                                            onClick={() => handleDeleteImage(index)}
                                                            className="absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-700 rounded-full text-white hidden group-hover:block cursor-pointer"
                                                        >
                                                            <MdDelete />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className='grid gap-1'>
                                    <label htmlFor="" className='font-medium'>Category</label>
                                    <div>
                                        <select
                                            className='bg-blue-50 border w-full p-2 rounded-md'
                                            value={selectCategory}  // El valor seleccionado se guarda en selectCategory
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                

                                                // Agregar solo el ID de la categoría seleccionada
                                                setData((prev) => ({
                                                    ...prev,
                                                    categoryId: [...prev.categoryId, value]  // Almacenamos solo el ID
                                                }));

                                                setSelectCategory("");  // Limpiar la selección después de agregarla
                                            }}
                                        >
                                            <option value="">Select Category</option>
                                            {
                                                allCategory.map((c, index) => (
                                                    <option key={index} value={c._id}>
                                                        {c.name}
                                                    </option>
                                                ))
                                            }
                                        </select>

                                        <div className='flex flex-wrap gap-3'>
                                            {
                                                data.categoryId.map((categoryId, index) => {
                                                    const category = allCategory.find(c => c._id === categoryId);  // Buscar el objeto categoría por el ID
                                                    return category ? (
                                                        <div key={categoryId + index} className='text-sm flex items-center rounded p-1 gap-1 bg-blue-50 mt-2'>
                                                            <p>{category.name}</p>
                                                            <div>
                                                                <IoClose
                                                                    size={20}
                                                                    className='hover:text-red-500 cursor-pointer'
                                                                    onClick={() => handleRemoveCategorySelected(index)} // Función para eliminar la categoría seleccionada
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : null;
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>


                                <div className='grid gap-1'>
                                    <label htmlFor="" className='font-medium'>Sub Category</label>
                                    <div>
                                        <select
                                            className='bg-blue-50 border w-full p-2 rounded-md'
                                            value={selectSubCategory}  // El valor seleccionado se guarda en selectSubCategory
                                            onChange={(e) => {
                                                const value = e.target.value;
                                               

                                                // Agregar solo el ID de la subcategoría seleccionada
                                                setData((prev) => ({
                                                    ...prev,
                                                    subCategoryId: [...prev.subCategoryId, value]  // Almacenamos solo el ID
                                                }));

                                                setSelectSubCategory("");  // Limpiar la selección después de agregarla
                                            }}
                                        >
                                            <option value="">Select Sub Category</option>
                                            {
                                                allSubCategory.map((c, index) => (
                                                    <option key={index} value={c._id}>
                                                        {c.name}
                                                    </option>
                                                ))
                                            }
                                        </select>

                                        <div className='flex flex-wrap gap-3'>
                                            {
                                                data.subCategoryId.map((subCategoryId, index) => {
                                                    const subCategory = allSubCategory.find(c => c._id === subCategoryId);  // Buscar el objeto subcategoría por el ID
                                                    return subCategory ? (
                                                        <div key={subCategoryId + index} className='text-sm flex items-center rounded p-1 gap-1 bg-blue-50 mt-2'>
                                                            <p>{subCategory.name}</p>
                                                            <div>
                                                                <IoClose
                                                                    size={20}
                                                                    className='hover:text-red-500 cursor-pointer'
                                                                    onClick={() => handleRemoveSubCategorySelected(index)} // Función para eliminar la subcategoría seleccionada
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : null;
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>


                                <div className='grid gap-1'>
                                    <label htmlFor="unit" className='font-medium'>Unit</label>

                                    <input type="text"
                                        id='unit'
                                        placeholder='Enter product unit'
                                        name='unit'
                                        value={data.unit}
                                        onChange={handleChange}
                                        className='bg-blue-50 p-2 outline-none border border-blue-200 focus-within:border-primary-Green rounded-md'
                                        required
                                    />
                                </div>

                                <div className='grid gap-1'>
                                    <label htmlFor="stock" className='font-medium'>Number of Stock</label>

                                    <input type="number"
                                        id='stock'
                                        placeholder='Enter product stock'
                                        name='stock'
                                        value={data.stock}
                                        onChange={handleChange}
                                        className='bg-blue-50 p-2 outline-none border border-blue-200 focus-within:border-primary-Green rounded-md'
                                        required
                                    />
                                </div>

                                <div className='grid gap-1'>
                                    <label htmlFor="price" className='font-medium'>Price</label>

                                    <input type="number"
                                        id='price'
                                        placeholder='Enter product price'
                                        name='price'
                                        value={data.price}
                                        onChange={handleChange}
                                        className='bg-blue-50 p-2 outline-none border border-blue-200 focus-within:border-primary-Green rounded-md'
                                        required
                                    />
                                </div>

                                <div className='grid gap-1'>
                                    <label htmlFor="discount" className='font-medium'>Discount</label>

                                    <input type="number"
                                        id='discount'
                                        placeholder='Enter product discount'
                                        name='discount'
                                        value={data.discount}
                                        onChange={handleChange}
                                        className='bg-blue-50 p-2 outline-none border border-blue-200 focus-within:border-primary-Green rounded-md'
                                        required
                                    />
                                </div>

                                {/** add more fields  */}
                                {
                                    Object?.keys(data?.more_details)?.map((k, index) => {
                                        return (
                                            <div className='grid gap-1'>
                                                <label className='font-medium' htmlFor={k}>{k}</label>

                                                <input type="text"
                                                    id={k}
                                                    key={index + "adddMorFields"}
                                                    value={data?.more_details[k]}
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                        setData((preve) => {
                                                            return {
                                                                ...preve,
                                                                more_details: {
                                                                    ...preve.more_details,
                                                                    [k]: value
                                                                }
                                                            }
                                                        })
                                                    }}
                                                    className='bg-blue-50 p-2 outline-none border border-blue-200 focus-within:border-primary-Green rounded-md'
                                                    
                                                />
                                            </div>
                                        )
                                    })
                                }

                                <div onClick={() => setOpenAddField(true)} className='inline-block bg-white text-primary-Green hover:bg-primary-Green py-1 
          px-3 w-36 text-center font-semibold border border-primary-Green hover:text-white rounded cursor-pointer'>
                                    Add Fields
                                </div>

                                <button
                                    className='bg-primary-Green text-white hover:bg-white py-1 
                  px-3 text-center font-semibold border 
                  border-primary-Green hover:text-primary-Green rounded cursor-pointer'
                                >
                                    Update Product
                                </button>
                            </form>
                        </div>
                        {
                            viewImageURl && (
                                <ViewImage url={viewImageURl} close={() => setViewImageURL("")} />
                            )
                        }

                        {
                            openAddField && (
                                <AddFieldComponent
                                    value={fieldName}
                                    onChange={(e) => setFieldName(e.target.value)}
                                    submit={handleAddField}
                                    close={() => setOpenAddField(false)} />
                            )
                        }
                    </div>
                </section>
            </div>
        </section>
    )
}

export default EditProductAdmin