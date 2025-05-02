import React, { useEffect, useState } from 'react'
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
        price: props.price,
        discount: props.discount,
        description: props.description,
        more_details: typeof props.more_details === "string" ? JSON.parse(props.more_details) : props.more_details || {},
        publish: props?.publish
    })

    const [imageLoading, setImageLoading] = useState(false)
    const [viewImageURl, setViewImageURL] = useState(false)
    const allCategory = useSelector(state => state.product.allCategory)
    const allSubCategory = useSelector(state => state.product.allSubCategory)
    const [selectCategory, setSelectCategory] = useState(data.categoryId[0] || "");  // Usa el primer valor de categoryId
    const [selectSubCategory, setSelectSubCategory] = useState(data.subCategoryId[0] || "");  // Lo mismo para subcategoría


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
                    price: "",
                    discount: "",
                    description: "",
                    publish: "",
                    more_details: {},
                })

            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    useEffect(() => {
        setSelectCategory(data.categoryId[0] || "");  // Establecer la categoría seleccionada cuando cambia data.categoryId
        setSelectSubCategory(data.subCategoryId[0] || "");  // Establecer la subcategoría seleccionada cuando cambia data.subCategoryId
    }, [data.categoryId, data.subCategoryId]);

    return (
        <section className='fixed top-0 left-0 right-0 bottom-0 bg-neutral-800 z-50 bg-opacity-70 p-4'>
            <div className='bg-white w-full p-4 mx-auto max-w-3xl overflow-y-auto h-full scrollbarCustom rounded-lg' >

                <div className='py-3 w-full rounded-md font-semibold bg-secundary shadow-md flex items-center justify-between px-4'>
                    <h2 className='font-extrabold uppercase text-primary-Green'>Subir Producto</h2>
                    <button onClick={close} className="hover:text-red-600">
                        <IoClose size={30} />
                    </button>
                </div>

                <div className='flex py-3 px-3 items-center justify-center w-full bg-secundary rounded-lg mt-4'>
                    <form className='grid gap-4 w-full max-w-4xl items-center bg-white px-3 py-3 rounded-lg' onSubmit={handleSubmit}>
                        <div className='grid gap-1 bg-secundary px-2 py-1 rounded-lg'>
                            <label htmlFor="name" className='font-bold text-primary-Green'>Nombre</label>

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

                        <div className='grid gap-1 bg-secundary px-2 py-1 rounded-lg'>
                            <label htmlFor="description" className='font-bold text-primary-Green'>Descripción</label>

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

                        <div className='bg-secundary px-2 py-1 rounded-lg'>
                            <p className='font-bold text-primary-Green'>Images</p>
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
                                    <div className="px-1 gap-2 h-24  bg-opacity-40 rounded-lg flex items-center">
                                        {data.image.map((img, index) => (
                                            <div key={index} className="h-20 w-20 rounded-lg min-w-20 bg-blue-50 relative group">
                                                <img
                                                    src={img}
                                                    alt={`Image ${index}`}
                                                    className="w-full h-full object-scale-down cursor-pointer p-1"
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

                        {/*Categoria y subCategoria */}
                        <div className='px-2 py-1 rounded-lg flex items-center justify-between gap-4 bg-secundary'>
                            <div className='grid gap-1 w-full'>
                                <label htmlFor="" className='font-bold text-primary-Green'>Categoría</label>
                                <div className='flex flex-wrap'>
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

                            <div className='grid gap-1 w-full'>
                                <label htmlFor="" className='font-bold text-primary-Green'>Sub Categoría</label>
                                <div className='flex flex-wrap gap-2'>
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
                        </div>

                        {/*Unidad, Precio y descuento */}
                        <div className='px-2 py-1 grid grid-cols-2 gap-2 bg-secundary rounded-lg'>
                            <div className='grid gap-1'>
                                <label htmlFor="unit" className='font-bold text-primary-Green'>Unidad</label>

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
                                <label htmlFor="price" className='font-bold text-primary-Green'>Precio</label>

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
                                <label htmlFor="discount" className='font-bold text-primary-Green'>Descuento</label>

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

                            <div className='grid gap-1'>
                                <label htmlFor="publish" className='font-medium'>Publicar</label>

                                <select id="publish" name="publish" className='bg-blue-50 border w-full p-2 rounded-md'>
                                    <option value="true">Sí</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                        </div>

                        {/** add more fields  */}
                        <div className='px-2 py-1 grid grid-cols-2 gap-2 bg-secundary rounded-lg'>
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
                        </div>
                        <div onClick={() => setOpenAddField(true)} className='inline-block bg-white text-primary-Green hover:bg-primary-Green py-1 
          px-3 w-36 text-center font-semibold border border-primary-Green hover:text-white rounded cursor-pointer'>
                            Añadir campos
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
    )
}

export default EditProductAdmin