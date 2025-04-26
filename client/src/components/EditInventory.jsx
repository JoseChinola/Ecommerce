import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';
import Loading from './Loading';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { useGlobalContext } from '../provider/useGlobalContext';

const EditInventory = ({ close, data }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      _id: data._id,
      warehouseId: data.warehouseId,
      productId: data.productId,
      stock: data.stock
    }
  });

  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { fetchInventario, fetchMovements } = useGlobalContext();

  // 1) Carga productos y almacenes al montar
  useEffect(() => {
    async function loadLists() {
      try {
        setLoading(true);
        const [prodResp, storeResp] = await Promise.all([
          Axios({ ...SummaryApi.getProduct, data: { page: 1, limit: 100, search: '' } }),
          Axios({ ...SummaryApi.getStore })
        ]);
        if (prodResp.data.success) setProductData(prodResp.data.data);
        if (storeResp.data.success) setWarehouseData(storeResp.data.data);
      } catch (err) {
        AxiosToastError(err);
      } finally {
        setLoading(false);
      }
    }
    loadLists();
  }, []);

  // 2) Cuando cambian data, productData o warehouseData, resetea el formulario
  useEffect(() => {
    if (!data || !productData.length || !warehouseData.length) return;

    // reset de react-hook-form
    reset({
      _id: data._id,
      warehouseId: data.warehouseId,
      productId: data.productId,
      stock: data.stock
    });

    // actualiza selectedProduct para mostrar precio e imagen
    const prod = productData.find(p => p._id === data.productId);
    if (prod) {
      let imgs = [];
      try { imgs = JSON.parse(prod.image); } catch { }
      setSelectedProduct({ ...prod, imageParsed: imgs[0] || '' });
    }
  }, [data, productData, warehouseData]);

  const handleProductChange = (e) => {
    const pid = e.target.value;
    const prod = productData.find(p => p._id === pid);
    if (prod) {
      let imgs = [];
      try { imgs = JSON.parse(prod.image); } catch { }
      setSelectedProduct({ ...prod, imageParsed: imgs[0] || '' });
    } else {
      setSelectedProduct(null);
    }
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const resp = await Axios({
        ...SummaryApi.updateInventory,
        data: {
          _id: formData._id,
          warehouseId: formData.warehouseId,
          productId: formData.productId,
          stock: formData.stock
        }
      });
      if (resp.data.success) {
        toast.success(resp.data.message);
        close?.();
        reset();               // limpia formulario
        fetchInventario();     // refetch en lista padre
        fetchMovements();     // refetch en lista padre
      }
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='bg-black fixed inset-0 z-50 bg-opacity-70 flex items-center overflow-auto p-2 sm:p-4'>
      <div className='bg-white p-4 w-full sm:max-w-2xl mx-auto rounded-md'>
        <div className='py-3 flex justify-between items-center border bg-blue-50 rounded-md px-2'>
          <h2 className='font-extrabold italic sm:text-lg uppercase'>Editar Inventario</h2>
          <button onClick={close} className="hidden sm:block hover:text-red-600">
            <IoClose size={30} />
          </button>
        </div>

        {loading && <div className='p-8'><Loading /></div>}

        <form onSubmit={handleSubmit(onSubmit)} className='mt-4 bg-white border p-2 rounded-lg flex flex-col gap-4'>
          {/* Producto */}
          <div className='border p-2 rounded-lg'>
            <label htmlFor="productId">Selecciona el producto</label>
            <select
              id="productId"
              {...register('productId', { required: true })}
              onChange={handleProductChange}
              className='w-full border p-2 rounded-md outline-none'
            >
              <option value="">Selecciona</option>
              {productData.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            {selectedProduct && (
              <div className='mt-2 p-2 bg-gray-50 rounded'>
                <p className='text-sm'><strong>Precio:</strong> ${selectedProduct.price}</p>
                <img
                  src={selectedProduct.imageParsed}
                  alt={selectedProduct.name}
                  className='w-14 h-14 object-cover rounded-md border mt-1'
                />
              </div>
            )}
          </div>

          {/* Almacén */}
          <div className='border p-2 rounded-lg'>
            <label htmlFor="warehouseId">Selecciona el Almacén</label>
            <select
              id="warehouseId"
              {...register('warehouseId', { required: true })}
              className='w-full border p-2 rounded-md outline-none'
            >
              <option value="">Selecciona</option>
              {warehouseData.map(w => (
                <option key={w._id} value={w._id}>{w.name}</option>
              ))}
            </select>
          </div>

          {/* Stock */}
          <div className='relative border p-2 rounded-lg'>
            <label htmlFor="stock">Cantidad:</label>
            <input
              id='stock'
              type="number"
              placeholder='Introduce la cantidad'
              {...register('stock', { required: true })}
              className='w-full border border-gray-300 bg-blue-50 p-2 pl-10 rounded-md focus:ring-2 focus:ring-blue-500 peer'
            />
            <MdOutlineProductionQuantityLimits className="absolute left-3 top-2/3 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
          </div>

          <button
            type='submit'
            disabled={loading}
            className={`w-full py-2 font-semibold text-white rounded-md transition 
              ${loading ? 'bg-primary-Green opacity-50 cursor-not-allowed' : 'bg-primary-Green hover:bg-green-600'}`}
          >
            {loading ? 'Procesando...' : 'Actualizar'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditInventory;