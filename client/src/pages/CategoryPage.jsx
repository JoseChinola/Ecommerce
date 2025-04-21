import React, { useEffect, useState } from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import UploadCategoryModel from '../components/UploadCategoryModel';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import AxiosToastError from '../utils/AxiosToastError';
import EditCategory from '../components/EditCategory';
import ConfirmBox from '../components/ConfirmBox';
import { useSelector } from 'react-redux';




const CategoryPage = () => {
    const [openUploadCategory, setOpenUploadCategory] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState({ _id: '' });
    const [dataEdit, setDataOpenEdit] = useState({ name: "", image: "" });

    // const allCategory = useSelector(state => state.product.allCategory);


    // useEffect(() => {
    //     if (allCategory.length > 0) {
    //         setData(allCategory);
    //         setLoading(false);
    //     }
    // }, [allCategory]);

    const fetchCategory = async () => {
        try {
            setLoading(true)
            const res = await Axios({
                ...SummaryApi.getcategory
            })
            const { data: resData } = res
            if (resData.success) {
                setData(resData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])

    const handleDeleteCategory = async () => {
        try {
            const res = await Axios({
                ...SummaryApi.deleteCategory,
                data: deleteCategory
            });
            const { data: resData } = res;

            if (resData.success) {
                setData(prevData => prevData.filter(category => category._id !== deleteCategory._id));
                setOpenConfirmDelete(false);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className='p-3 bg-white rounded-lg'>
            {loading ? (
                <div className='flex justify-center items-center min-h-[50vh]'>
                    <Loading />
                </div>
            ) : (
                <>
                    <div className='py-4 px-2 rounded-md font-semibold bg-blue-50 shadow-md flex items-center justify-between'>
                        <h2 className='font-extrabold uppercase text-primary-Green'>Category</h2>
                        <button onClick={() => setOpenUploadCategory(true)} className='text-sm border text-green-500 font-semibold border-primary-Green hover:bg-primary-Green hover:text-white rounded flex px-3 py-1 items-center justify-center gap-1'>
                            <IoIosAddCircleOutline size={22} /> Add Category
                        </button>
                    </div>

                    <div className='p-2 mt-4 grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map((category) => (
                                <div key={category._id} className="lg:w-52 lg:h-full flex group flex-col bg-blue-50 gap-2 items-center rounded-md border-2 shadow-md relative">
                                    <img src={category.image} alt={category.name} className="w-58 h-44 object-cover rounded-md border-2" />
                                    <p className="text-green-500 py-2 font-semibold capitalize text-center">{category.name}</p>

                                    <div className="px-5 items-center justify-between w-full h-full absolute bottom-0 left-0 right-0 flex gap-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
                                        <button onClick={() => { setOpenEdit(true); setDataOpenEdit(category); }} className="bg-blue-100 transition-all duration-300 ease-in-out py-1.5 border rounded-md px-4 hover:scale-105 text-neutral-700 font-semibold hover:text-white hover:bg-green-500">
                                            <AiOutlineEdit />
                                        </button>
                                        <button onClick={() => { setOpenConfirmDelete(true); setDeleteCategory(category); }} className="bg-red-200 transition-all duration-300 ease-in-out hover:scale-105 text-neutral-700 border rounded-md py-1.5 px-4 hover:text-white font-semibold hover:bg-red-500">
                                            <RiDeleteBinLine />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <NoData />
                        )}
                    </div>

                    {openUploadCategory && (
                        <UploadCategoryModel fetchData={fetchCategory} close={() => setOpenUploadCategory(false)} />
                    )}
                    {openEdit && (
                        <EditCategory data={dataEdit} fetchData={fetchCategory} close={() => setOpenEdit(false)} />
                    )}
                    {openConfirmDelete && (
                        <ConfirmBox
                            close={() => setOpenConfirmDelete(false)}
                            cancel={() => setOpenConfirmDelete(false)}
                            confirm={handleDeleteCategory}
                        />
                    )}
                </>
            )}
        </section>
    );
};

export default CategoryPage