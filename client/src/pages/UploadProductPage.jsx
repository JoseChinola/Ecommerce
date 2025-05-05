import React, { useState } from 'react'
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


const UploadProductPage = ({ onClose, fetchProductData }) => {
  const [data, setData] = useState({
    name: "",
    image: [],
    categoryId: [],
    subCategoryId: [],
    unit: "",
    price: "",
    discount: "",
    description: "",
    publish: '',
    more_details: {},

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

  const handleRemoveCategorySelected = (index) => {
    setData((prev) => ({
      ...prev,
      categoryId: prev.categoryId.filter((_, i) => i !== index),
    }));
  };
  
  const handleRemoveSubCategorySelected = (index) => {
    setData((prev) => ({
      ...prev,
      subCategoryId: prev.subCategoryId.filter((_, i) => i !== index),
    }));
  };

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
        ...SummaryApi.createProduct,
        data: data
      })
      const { data: resData } = res
      if (resData.success) {
        successAlert(resData.message)
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

        if (fetchProductData) {
          fetchProductData()
        }
        if (onClose) {
          onClose()
        }

      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className='fixed w-full top-0 bottom-0 left-0 right-0 p-3 rounded z-50 bg-neutral-800 bg-opacity-70 flex items-center justify-center overflow-auto'>
      <div className='bg-white w-full p-4 mx-auto max-w-3xl rounded overflow-y-auto h-full scrollbarCustom'>
        <div className='py-3 w-full rounded-md font-semibold bg-secundary shadow-md flex items-center justify-between px-4'>
          <h2 className='font-extrabold uppercase text-primary-Green'>Subir Producto</h2>
          <button onClick={onClose} className="hover:text-red-600">
            <IoClose size={30} />
          </button>
        </div>

        <div className='flex py-3 px-3 items-center justify-center w-full bg-secundary rounded-lg mt-4'>
          <form className='grid gap-4 w-full max-w-4xl items-center bg-white px-3 py-3 rounded-lg' onSubmit={handleSubmit}>
            <div className='grid gap-1 bg-secundary px-2 py-1 rounded-lg'>
              <label htmlFor="name" className='font-bold text-primary-Green'>Nombre</label>

              <input type="text"
                id='name'
                placeholder='Introduzca el nombre del producto'
                name='name'
                value={data.name}
                onChange={handleChange}
                className='bg-blue-50 p-2 outline-none border border-blue-200 focus-within:border-primary-Green rounded-md'
                required
              />
            </div>

            <div className='grid gap-1 px-2 py-1 rounded-lg bg-secundary'>
              <label htmlFor="description" className='font-bold text-primary-Green'>Descripción</label>

              <textarea type="text"
                id='description'
                placeholder='Introduzca la descripcion'
                name='description'
                value={data.description}
                onChange={handleChange}
                className='bg-blue-50 p-2 outline-none border border-blue-200 focus-within:border-primary-Green rounded-md resize-none'
                multiple
                rows={4}
                required
              />
            </div>

            <div className='px-2 py-1 rounded-lg bg-secundary'>
              <p className='font-bold text-primary-Green'>Images</p>
              <div>
                {/* Display uploaded images */}
                {data.image.length > 0 && ( // Solo muestra el div si hay imágenes
                  <div className="px-4 py-1 gap-2 h-24 border bg-blue-50 bg-opacity-40 rounded flex items-center">
                    {data.image.map((img, index) => (
                      <div key={index} className="h-20 w-20 rounded-lg aspect-square min-w-20 bg-blue-50 relative group px-2">
                        <img
                          src={img}
                          alt={`Image ${index}`}
                          className="w-full h-full object-contain cursor-pointer"
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

                {/* Upload button */}
                <label
                  htmlFor="productImage"
                  className="bg-blue-50 h-24 border rounded-lg border-blue-200 flex items-center justify-center cursor-pointer"
                >
                  <div className="flex justify-center items-center flex-col">
                    {imageLoading ? <Loading /> : (
                      <>
                        <FaCloudUploadAlt size={35} />
                        <p>Subir Imagen</p>
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
              </div>
            </div>

            {/*Categoria y subCategoria */}
            <div className='px-2 py-1 rounded-lg flex items-center justify-between gap-4 bg-secundary'>
              <div className='grid gap-1 w-full'>
                <label htmlFor="" className='font-bold text-primary-Green'>Categoría</label>
                <div className='flex flex-wrap gap-2'>
                  <select
                    className='bg-blue-50 border w-full p-2 rounded-md'
                    value={selectCategory}
                    onChange={(e) => {
                      const value = e.target.value
                      const category = allCategory.find(el => el._id === value)

                      setData((prev) => {
                        return {
                          ...prev,
                          categoryId: [...prev.categoryId, category]
                        }
                      })

                      setSelectCategory("")
                    }}
                  >
                    <option value="">Selecciona Categoría</option>
                    {
                      allCategory.map((c, index) => {
                        return (
                          <option key={index} value={c?._id}>
                            {c?.name}
                          </option>
                        )
                      })
                    }
                  </select>

                  <div className='flex flex-wrap gap-3'>
                    {
                      data.categoryId.map((c, index) => {
                        return (
                          <div key={c._id + index + "productsection"} className='text-sm flex items-center rounded p-1 gap-1 bg-blue-50'>
                            <p>{c.name}</p>
                            <div>
                              <IoClose size={20} className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveCategorySelected(index)} />
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>

              <div className='grid gap-1 w-full'>
                <label htmlFor="" className='font-bold text-primary-Green' >Subcategoría</label>
                <div className='flex flex-wrap gap-2'>
                  <select
                    className='bg-blue-50 border w-full p-2 rounded-md'
                    value={selectSubCategory}
                    onChange={(e) => {
                      const value = e.target.value
                      const subCategory = allSubCategory.find(el => el._id === value)

                      setData((prev) => {
                        return {
                          ...prev,
                          subCategoryId: [...prev.subCategoryId, subCategory]
                        }
                      })

                      setSelectSubCategory("")
                    }}
                  >
                    <option value="">Selecciona subcategoría</option>
                    {
                      allSubCategory.map((c, index) => {
                        return (
                          <option key={index} value={c?._id} >
                            {c?.name}
                          </option>
                        )
                      })
                    }
                  </select>

                  <div className='flex flex-wrap gap-3'>
                    {
                      data.subCategoryId.map((c, index) => {
                        return (
                          <div key={c._id + index + "subCategorySection"} className='text-sm flex items-center rounded p-1 gap-1 bg-blue-50'>
                            <p>{c.name}</p>
                            <div>
                              <IoClose size={20} className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveSubCategorySelected(index)} />
                            </div>
                          </div>
                        )
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
                  placeholder='Introducir unidad de producto'
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
                  placeholder='Introduzca el precio del producto'
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
                  placeholder='Introduzca el descuento del producto'
                  name='discount'
                  value={data.discount}
                  onChange={handleChange}
                  className='bg-blue-50 p-2 outline-none border border-blue-200 focus-within:border-primary-Green rounded-md'
                  required
                />
              </div>

              <div className='grid gap-1'>
                <label htmlFor="discount" className='font-bold text-primary-Green'>Publicar</label>

                <select
                  id="publish"
                  name="publish"
                  value={data.publish}
                  onChange={handleChange}
                  className='bg-blue-50 border w-full p-2 rounded-md'
                >
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
                    <div className='grid gap-1 w-full' key={index}>
                      <div className="flex items-center gap-3">
                        <label className='font-bold text-primary-Green capitalize' htmlFor={k}>{k}</label>
                        <div>
                          <IoClose size={20} className='hover:text-red-500 cursor-pointer' onClick={() => {
                            // Eliminar el campo de `more_details` en el estado
                            setData(prev => {
                              const newMoreDetails = { ...prev.more_details };
                              delete newMoreDetails[k]; // Elimina el campo
                              return { ...prev, more_details: newMoreDetails }; // Actualiza el estado
                            });
                          }} />
                        </div>

                      </div>

                      <input
                        type="text"
                        id={k}
                        value={data?.more_details[k]}
                        onChange={(e) => {
                          const value = e.target.value;
                          setData((prev) => {
                            return {
                              ...prev,
                              more_details: {
                                ...prev.more_details,
                                [k]: value
                              }
                            };
                          });
                        }}
                        className='bg-blue-50 p-2 outline-none border border-blue-200 focus-within:border-primary-Green rounded-md'
                        required
                      />
                    </div>
                  );
                })
              }
            </div>


            <div onClick={() => setOpenAddField(true)} className='inline-block bg-white text-primary-Green hover:bg-primary-Green py-1 
          px-3 w-36 text-center font-semibold border border-primary-Green hover:text-white rounded cursor-pointer'>
              Añadir campos
            </div>

            <button
              className=' text-primary-Green hover:bg-primary-Green py-2 
                  px-3 text-center font-semibold border 
                  border-primary-Green hover:text-white rounded-lg cursor-pointer'
            >
              Agregar Producto
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

export default UploadProductPage