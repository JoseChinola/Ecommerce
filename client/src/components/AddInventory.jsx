import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';
import Loading from './Loading';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { useGlobalContext } from '../provider/useGlobalContext';

const AddInventory = ({ close }) => {
    const { register, handleSubmit, reset, } = useForm()
    const [loading, setLoading] = useState(false)
    const [productData, setProductData] = useState([])
    const [warehouseData, setWarehouseData] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { fetchInventario, fetchMovements } = useGlobalContext()


    useEffect(() => {
        fetchProductData()
        fetchStore()
    }, [])

    const fetchStore = async () => {

        try {
            const response = await Axios({
                ...SummaryApi.getStore

            })

            const { data: resData } = response
            if (resData.success) {
                setWarehouseData(resData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleProductChange = (e) => {
        const productId = e.target.value;
        const product = productData.find(p => p._id === productId);
        if (product) {
            // Parsea el campo image
            let parsedImages = [];
            try {
                parsedImages = JSON.parse(product.image);
            } catch (err) {
                console.error('Error al parsear la imagen del producto', err);
            }
            setSelectedProduct({
                ...product,
                imageParsed: parsedImages[0] || '', // Solo tomamos la primera imagen
            });
        } else {
            setSelectedProduct(null);
        }
    };

    const fetchProductData = async () => {
        try {
            setLoading(true)
            const resp = await Axios({
                ...SummaryApi.getProduct,
                data: {
                    page: 1,
                    limit: 100,
                    search: ''
                }
            })

            const { data: resData } = resp

            if (resData.success) {
                setProductData(resData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }


    const onSubmit = async (data) => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.createInventory,
                data: {
                    warehouseId: data.warehouseId,
                    productId: data.productId,
                    stock: data.stock
                }
            })

            const { data: respondata } = response
            if (respondata.success) {
                toast.success(respondata.message)
                if (close) {
                    close()
                    reset()
                    fetchInventario()
                    fetchMovements()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }



    return (
        <section className='bg-black fixed top-0 bottom-0 left-0 right-0 z-50 bg-opacity-70 flex items-center h-screen overflow-auto sm:p-4 p-2'>
            <div className='bg-secundary p-6 w-full sm:max-w-3xl mx-auto rounded-md'>
                <div className='p-1 flex justify-between items-center border bg-blue-50 rounded-md px-2'>
                    <h2 className='font-semibold italic sm:text-lg'>Crear Inventario</h2>
                    <button onClick={close} className="w-fit ml-auto hover:text-red-600">
                        <IoClose size={30} />
                    </button>
                </div>

                {loading && (
                    <div className='p-8'>
                        <Loading />
                    </div>
                )}

                <form className='mt-4 flex flex-col gap-4 border p-2 rounded-lg  bg-white' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid sm:grid-cols-1 gap-4'>

                        <div className='grid gap-1 border p-2 rounded-lg'>
                            <label htmlFor="productId">Selecciona el producto</label>
                            <div className=' focus-within:border-primary-Green rounded-md'>
                                <select
                                    id="productId"
                                    className='w-full bg-transparent border p-2 rounded-md outline-none'
                                    {...register('productId', { required: true })}
                                    onChange={handleProductChange}
                                    defaultValue=""
                                >
                                    <option value="">Selecciona</option>
                                    {
                                        productData.map((product) => (
                                            <option key={product._id} value={product._id}>
                                                {product.name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            {selectedProduct && (
                                <div className='mt-1 p-2 rounded bg-gray-50'>
                                    <p className='text-sm'><strong>Precio:</strong> ${selectedProduct.price}</p>
                                    <img
                                        src={selectedProduct.imageParsed}
                                        alt={selectedProduct.name}
                                        className='w-14 h-14 object-cover mt-2 rounded-md border'
                                    />
                                </div>
                            )}
                        </div>

                        <div className='grid gap-1 border p-2'>
                            <label htmlFor="warehouseId">Selecciona el Almancen</label>
                            <div className='border focus-within:border-primary-Green rounded-md'>
                                <select
                                    id="warehouseId"
                                    className='w-full bg-transparent border p-2 rounded-md outline-none'
                                    {...register('warehouseId', { required: true })}
                                >
                                    <option value="">Selecciona</option>
                                    {
                                        warehouseData.map((wareouse) => (
                                            <option key={wareouse._id} value={wareouse._id}>
                                                {wareouse.name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>

                        <div className='grid gap-1 relative'>
                            <label htmlFor="stock">Cantidad:</label>
                            <input
                                type="number"
                                placeholder='Entra la cantidad del producto'
                                id='stock'
                                className='bg-blue-50 p-2 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer'
                                {...register('stock', { required: true })}
                            />
                            <MdOutlineProductionQuantityLimits className="absolute left-3 top-2/3 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
                        </div>

                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className={`bg-primary-Green w-full py-2 font-semibold text-white rounded-md transition 
        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                    >
                        {loading ? 'Procesando...' : 'Submit'}
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AddInventory