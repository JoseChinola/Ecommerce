import React, { useState } from 'react'
import CardLoading from './CardLoading'

const SearchPage = () => {
    const [data, setData] = useState([])
    const [loading, setloading] = useState(true)

    return (
        <section className='bg-white'>
            <div className='container mx-auto p-2'>
                <p className='font-semibold'>Search Result: {data.length}</p>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-2 lg:gap-3 py-4'>
                    {/** Loading data */}
                    {
                        loading && (
                            Array(12    ).fill(null).map((_, index) => (
                                <CardLoading key={index} />
                            ))
                        )
                    }
                </div>
            </div>
        </section>
    )
}

export default SearchPage