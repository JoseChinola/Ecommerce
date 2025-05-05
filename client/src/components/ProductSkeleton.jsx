import React from 'react'

const ProductSkeleton = () => {
    return (
        <section className="container mx-auto p-4 grid lg:grid-cols-2 animate-pulse bg-white rounded-lg">
            {/* Imagen principal */}
            <div>
                <div className="bg-gray-300 lg:min-h-[50vh] lg:max-h-[50vh] rounded-md min-h-56 max-h-56 w-full"></div>

                {/* Indicadores de imagen */}
                <div className="flex items-center justify-center gap-3 my-3">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="bg-gray-300 w-3 h-3 lg:w-5 lg:h-5 rounded-full"></div>
                    ))}
                </div>

                {/* Miniaturas */}
                <div className="grid relative">
                    <div className="flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="w-20 h-20 min-h-20 max-h-20 shadow-md rounded-md bg-gray-300"></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Información del producto */}
            <div className="p-1 lg:pl-8 text-base">
                <div className="bg-gray-300 w-20 h-6 rounded-full mb-2"></div>
                <div className="flex gap-4 items-center">
                    <div className="bg-gray-300 w-48 h-8 rounded-md"></div>
                    <div className="bg-gray-300 w-16 h-6 rounded-full"></div>
                </div>

                <div className="w-full h-0.5 bg-gray-300 my-4"></div>

                {/* Precio */}
                <div className="flex items-center gap-4">
                    <div className="bg-gray-300 w-16 h-6 rounded-md"></div>
                    <div className="border border-gray-300 px-4 py-2 rounded-md bg-gray-300 w-24"></div>
                    <div className="bg-gray-300 w-10 h-10 rounded-full"></div>
                </div>

                {/* Beneficios */}
                <div className="mt-6">
                    <div className="bg-gray-300 w-40 h-6 rounded-md mb-4"></div>

                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex items-center gap-4 my-3">
                            <div className="bg-gray-300 w-20 h-20 rounded-md"></div>
                            <div className="flex flex-col gap-2">
                                <div className="bg-gray-300 w-40 h-6 rounded-md"></div>
                                <div className="bg-gray-300 w-64 h-4 rounded-md"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductSkeleton;