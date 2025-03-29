import React, { useEffect, useState } from 'react'
import { IoIosAddCircleOutline } from 'react-icons/io'
import UploadSubCategory from '../components/UploadSubCategory'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../cammon/SummaryApi'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import { HiPencil } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import EditSubCategory from '../components/EditSubCategory'
import ConfirmBox from '../components/ConfirmBox'
import toast from 'react-hot-toast'
import Loading from '../components/Loading'


const SubCategoryPage = () => {
    const [openAddSubCategory, setOpenAddSubCategory] = useState(false)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const columnHelper = createColumnHelper()
    const [ImageURL, setImageURL] = useState("")
    const [openEdit, setOpenEdit] = useState(false)
    const [editData, setEditData] = useState({
        _id: ""
    })
    const [deleteSubCategory, setDeleteSubCategory] = useState({
        _id: ""
    })
    const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false)

    const fetchSubCategory = async () => {
        try {
            setLoading(true)
            const res = await Axios({
                ...SummaryApi.getSubCategory
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
        fetchSubCategory()
    }, [])

    const column = [
        columnHelper.accessor('name', {
            header: "Name"
        }),
        columnHelper.accessor('image', {
            header: "Image",
            cell: ({ row }) => {
                return <div className='flex justify-center items-center'>
                    <img
                        src={row.original?.image}
                        alt={row.original?.name}
                        className='w-8 h-8 cursor-pointer rounded bg-transparent'
                        onClick={() => setImageURL(row.original?.image)}
                    />
                </div>
            }
        }),
        columnHelper.accessor('category', {
            header: "Category",
            cell: ({ row }) => {
                return (
                    <>
                        <p>
                            {
                                row.original.categoryData?.name
                            }
                        </p>
                    </>
                )
            }
        }),
        columnHelper.accessor('_id', {
            header: "Action",
            cell: ({ row }) => {
                return (
                    <div className='flex items-center justify-center gap-3 '>
                        <button onClick={() => {
                            setOpenEdit(true)
                            setEditData(row.original)
                        }} className='p-2 bg-green-100 text-green-800 rounded-full hover:text-green-500'>
                            <HiPencil size={20} />
                        </button>
                        <button onClick={() => {
                            setOpenDeleteConfirmBox(true)
                            setDeleteSubCategory(row.original)
                        }}
                            className='p-2 bg-red-100 rounded-full text-red-800 hover:text-red-500'>
                            <MdDelete size={20} />
                        </button>
                    </div>
                )
            }
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
            <div className='lg:py-4 py-2 px-2 rounded-md font-semibold bg-blue-50 shadow-md flex items-center justify-between'>
                <h2 className='font-extrabold uppercase'>Sub Category</h2>
                <button onClick={() => setOpenAddSubCategory(true)} className='text-sm border text-green-500 font-semibold border-primary-Green hover:bg-primary-Green hover:text-white rounded flex lg:px-3 py-1 items-center justify-center gap-1'>
                    <IoIosAddCircleOutline size={22} /> Add Sub Category
                </button>
            </div>

            <div className='overflow-auto w-full max-w-[95vw]'>
                {
                    loading ? (<div className='p-8'>
                        <Loading />
                    </div>

                    ) : (
                        <DisplayTable
                            data={data}
                            column={column}
                        />
                    )
                }

            </div>

            {
                openAddSubCategory && (
                    <UploadSubCategory fetchData={fetchSubCategory} close={() => setOpenAddSubCategory(false)} />
                )
            }
            {
                ImageURL && (
                    <ViewImage url={ImageURL} close={() => setImageURL(false)} />
                )
            }
            {
                openEdit && (
                    <EditSubCategory
                        data={editData}
                        close={() => setOpenEdit(false)}
                        fetchData={fetchSubCategory}
                    />
                )
            }

            {
                openDeleteConfirmBox && (
                    <ConfirmBox
                        cancel={() => setOpenDeleteConfirmBox(false)}
                        close={() => setOpenDeleteConfirmBox(false)}
                        confirm={handleDeleteSubCategory}
                    />
                )
            }
        </section>


    )
}

export default SubCategoryPage