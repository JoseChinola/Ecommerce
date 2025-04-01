import React, { useState, useEffect } from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";




const Carousel = ({ bannerDesktp, bannerMobile }) => {
    // Estado para controlar la imagen actual
    const [currentIndex, setCurrentIndex] = useState(0);

    // Array de imágenes (puedes modificarlo con más imágenes si lo necesitas)
    const images = [
        bannerDesktp, // Imagen de escritorio
        bannerMobile  // Imagen de móvil
    ];

    // Cambiar la imagen cada 3 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 4000); // Cambiar cada 3 segundos

        return () => clearInterval(interval);
    }, []);

    // Cambiar la imagen manualmente
    const goToNext = () => {
        setCurrentIndex((currentIndex + 1) % images.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((currentIndex - 1 + images.length) % images.length);
    };

    return (
        <div className='relative flex items-center'>
            <div className='w-full h-56'>
                <img
                    src={images[currentIndex]}
                    alt="banner"
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>


            {/* Botones de navegación */}
            <div className='w-full left-0 right-0 container mx-auto px-2 absolute hidden xs:lex sm:flex md:flex lg:flex justify-between'>
                <button onClick={goToPrevious} className='z-10 relative bg-white hover:bg-gray-200 hover:text-primary-Green shadow-lg p-2 rounded-full text-lg '>
                    <FaAngleLeft size={25} />
                </button>
                <button onClick={goToNext} className='z-10 relative bg-white hover:bg-gray-200 hover:text-primary-Green shadow-lg p-2 rounded-full text-lg '>
                    <FaAngleRight size={25} />
                </button>
            </div>
        </div>
    );
};

export default Carousel;
