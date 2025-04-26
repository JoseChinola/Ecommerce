import React, { useEffect, useState } from 'react'
import { IoIosAddCircleOutline } from 'react-icons/io'
import UploadSubCategory from '../components/UploadSubCategory'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../cammon/SummaryApi'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import { HiPencil } from "react-icons/hi"
import { MdDelete, MdNavigateBefore, MdNavigateNext } from "react-icons/md"
import EditSubCategory from '../components/EditSubCategory'
import ConfirmBox from '../components/ConfirmBox'
import toast from 'react-hot-toast'
import Loading from '../components/Loading'

const SubCategoryPage = () => {
    const [openAddSubCategory, setOpenAddSubCategory] = useState(false)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    const columnHelper = createColumnHelper()
    const [ImageURL, setImageURL] = useState("")
    const [openEdit, setOpenEdit] = useState(false)
    const [editData, setEditData] = useState({ _id: "" })
    const [deleteSubCategory, setDeleteSubCategory] = useState({ _id: "" })
    const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false)

    const fetchSubCategory = async () => {
        try {
            setLoading(true)
            const res = await Axios({ ...SummaryApi.getSubCategory })
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
        fetchSubCategory()
    }, [])

    useEffect(() => {
        setPage(1)
    }, [itemsPerPage])

    const totalPageCount = Math.ceil(data.length / itemsPerPage)
    const paginatedItems = data.slice((page - 1) * itemsPerPage, page * itemsPerPage)

    const handleNext = () => {
        if (page < totalPageCount) setPage(prev => prev + 1)
    }

    const handlePrevious = () => {
        if (page > 1) setPage(prev => prev - 1)
    }

    const column = [
        columnHelper.accessor('name', { header: "Name" }),
        columnHelper.accessor('image', {
            header: "Image",
            cell: ({ row }) => (
                <div className='flex justify-center items-center'>
                    <img
                        src={row.original?.image}
                        alt={row.original?.name}
                        className='w-8 h-8 cursor-pointer rounded bg-transparent'
                        onClick={() => setImageURL(row.original?.image)}
                    />
                </div>
            )
        }),
        columnHelper.accessor('category', {
            header: "Category",
            cell: ({ row }) => <p>{row.original.categoryData?.name}</p>
        }),
        columnHelper.accessor('_id', {
            header: "Action",
            cell: ({ row }) => (
                <div className='flex items-center justify-center gap-3'>
                    <button
                        onClick={() => {
                            setOpenEdit(true)
                            setEditData(row.original)
                        }}
                        className='p-2 bg-green-100 text-green-800 rounded-full hover:text-green-500'
                    >
                        <HiPencil size={20} />
                    </button>
                    <button
                        onClick={() => {
                            setOpenDeleteConfirmBox(true)
                            setDeleteSubCategory(row.original)
                        }}
                        className='p-2 bg-red-100 rounded-full text-red-800 hover:text-red-500'
                    >
                        <MdDelete size={20} />
                    </button>
                </div>
            )
        })
    ]

    const handleDeleteSubCategory = async () => {
        try {
            const res = await Axios({
                ...SummaryApi.deleteSubCategory,
                data: deleteSubCategory
            })
            const { data: resData } = res
            if (resData.success) {
                toast.success(resData.message)
                fetchSubCategory()
                setOpenDeleteConfirmBox(false)
                setDeleteSubCategory({ _id: "" })
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='lg:p-3'>
            <div className='lg:py-4 py-2 px-4 rounded-md font-semibold bg-white shadow-md flex items-center justify-between'>
                <h2 className='font-extrabold uppercase'>Sub Category</h2>
                <button
                    onClick={() => setOpenAddSubCategory(true)}
                    className='text-sm border text-green-500 font-semibold border-primary-Green hover:bg-primary-Green hover:text-white rounded flex lg:px-3 py-1 items-center justify-center gap-1'
                >
                    <IoIosAddCircleOutline size={22} /> Add Sub Category
                </button>
            </div>

            <div className='overflow-auto w-full max-w-[95vw] bg-white mt-4 py-2 px-3 rounded-md'>
                {loading ? (
                    <div className='p-8'>
                        <Loading />
                    </div>
                ) : (
                    <DisplayTable
                        data={paginatedItems}
                        column={column}
                    />
                )}

                <div className='flex flex-col md:flex-row justify-between items-center gap-4 my-4'>
                    <div className='flex items-center gap-2'>
                        <label htmlFor="itemsPerPage" className='text-sm text-gray-700 font-medium'>Mostrar:</label>
                        <select
                            id="itemsPerPage"
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                            className='border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-Green'
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                        </select>
                        <span className='text-sm text-gray-600'>por página</span>
                    </div>

                    <div className='flex items-center gap-3'>
                        <button
                            onClick={handlePrevious}
                            disabled={page === 1}
                            className={`border px-3 py-1 rounded-md flex items-center justify-center ${page === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-primary-Green border-primary-Green hover:bg-primary-Green hover:text-white'}`}
                        >
                            <MdNavigateBefore size={18} />
                        </button>
                        <span className='text-sm font-semibold text-gray-700'>Página {page} de {totalPageCount || 1}</span>
                        <button
                            onClick={handleNext}
                            disabled={page === totalPageCount}
                            className={`border px-3 py-1 rounded-md flex items-center justify-center ${page === totalPageCount ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-primary-Green border-primary-Green hover:bg-primary-Green hover:text-white'}`}
                        >
                            <MdNavigateNext size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {openAddSubCategory && (
                <UploadSubCategory fetchData={fetchSubCategory} close={() => setOpenAddSubCategory(false)} />
            )}

            {ImageURL && (
                <ViewImage url={ImageURL} close={() => setImageURL(false)} />
            )}

            {openEdit && (
                <EditSubCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchSubCategory} />
            )}

            {openDeleteConfirmBox && (
                <ConfirmBox cancel={() => setOpenDeleteConfirmBox(false)} close={() => setOpenDeleteConfirmBox(false)} confirm={handleDeleteSubCategory} />
            )}
        </section>
    )
}

export default SubCategoryPage