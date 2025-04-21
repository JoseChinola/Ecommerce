import React, { useEffect, useState } from 'react'
import CardLoading from './CardLoading'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import SummaryApi from '../cammon/SummaryApi'
import CardProduct from '../components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import noData from '../assets/NothingHereYet.webp'
import { debounce } from 'lodash'  // Para mejorar la búsqueda

const SearchPage = () => {
    const [data, setData] = useState([])
    const [loading, setloading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [searchText, setSearchText] = useState('')
    const params = useLocation()

    const searchQuery = new URLSearchParams(params.search).get('q') || ''

    // Actualiza searchText con el valor de la URL al cargar la página
    useEffect(() => {
        setSearchText(searchQuery)
    }, [searchQuery])

    // Función de obtención de datos
    const fetchData = async () => {
        try {
            setloading(true)
            const response = await Axios({
                ...SummaryApi.searchProduct,
                data: {
                    search: searchText,
                    page: page
                }
            })

            const { data: responseData } = response
            if (responseData.success) {
                if (responseData.page === 1) {
                    setData(responseData.data)
                } else {
                    setData(prevData => [...prevData, ...responseData.data])
                }
                setTotalPage(Math.ceil(responseData.totalCount / 10)) // Calculamos el total de páginas
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setloading(false)
        }
    }

    // Usamos debounce para evitar peticiones rápidas al escribir
    const debouncedFetchData = debounce(fetchData, 500)

    useEffect(() => {
        if (searchText) {
            debouncedFetchData()
        }
    }, [page, searchText])

    const handleFetchMore = () => {
        if (totalPage > page) {
            setPage(prev => prev + 1)
        }
    }

    return (
        <section className='bg-white'>
            <div className='container mx-auto p-2'>
                <p className='font-semibold'>
                    Search Result for: "{searchText}" ({data.length} found)
                </p>
                <InfiniteScroll
                    dataLength={data.length}
                    hasMore={totalPage > page}
                    next={handleFetchMore}
                    loader={<CardLoading />}
                >
                    <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-2 lg:gap-3 py-4'>
                        {/* Mostrar productos cargados */}
                        {data.map((product, index) => (
                            <CardProduct data={product} key={product._id + "searchProduct" + index} />
                        ))}

                        {/* Mostrar cargando si hay más productos por cargar */}
                        {loading && Array(12).fill(null).map((_, index) => (
                            <CardLoading key={index} />
                        ))}
                    </div>
                </InfiniteScroll>

                {/* Mostrar imagen y mensaje si no hay datos */}
                {!data[0] && !loading && (
                    <div className='flex flex-col justify-center items-center w-fit mx-auto'>
                        <img src={noData} alt="No Data" className='w-full h-full max-w-xs max-h-[320px]' />
                        <p className='font-semibold my-2'>No results found for "{searchText}"</p>
                    </div>
                )}
            </div>
        </section>
    )
}

export default SearchPage
