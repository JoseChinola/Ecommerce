import React, { useState, useEffect, useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../cammon/SummaryApi";
import AddToCartButton from "./AddToCartButton";

const Carousel = () => {
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [carouselItems, setCarouselItems] = useState([]);
    const [itemsPerSlide, setItemsPerSlide] = useState(3);
    const intervalRef = useRef(null);

    // Estados para detectar el gesto de swipe
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50; // distancia mínima para considerar un swipe

    const fetchProductData = async () => {
        try {
            setLoading(true);
            const resp = await Axios({
                ...SummaryApi.getProduct,
                data: { page: 1, limit: 12 },
            });
            const { data: resData } = resp;
            if (resData.success) {
                const discountedProducts = resData.data.filter(product => product.discount > 0);
                const items = discountedProducts.map((product) => {
                    const images = product.image ? JSON.parse(product.image) : [];
                    return {
                        image: images.length > 0 ? images[0] : null,
                        discount: product.discount,
                        name: product.name,
                        _id: product._id
                    };
                }).filter(item => item.image !== null);
                setCarouselItems(items);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    // Hook para ajustar itemsPerSlide según el ancho de pantalla
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) { // ejemplo: mobile
                setItemsPerSlide(1);
            } else {
                setItemsPerSlide(3);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => { fetchProductData(); }, []);

    useEffect(() => {
        if (carouselItems.length > 0) {
            startAutoScroll();
            return () => stopAutoScroll();
        }
    }, [carouselItems, itemsPerSlide]);

    const startAutoScroll = () => {
        stopAutoScroll();
        intervalRef.current = setInterval(() => {
            goToNext();
        }, 4000);
    };

    const stopAutoScroll = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const goToNext = () => {
        stopAutoScroll();
        setCurrentIndex((prevIndex) => (prevIndex + itemsPerSlide) % carouselItems.length);
        startAutoScroll();
    };

    const goToPrevious = () => {
        stopAutoScroll();
        setCurrentIndex((prevIndex) => 
            (prevIndex - itemsPerSlide + carouselItems.length) % carouselItems.length
        );
        startAutoScroll();
    };

    // Funciones para manejar el swipe
    const onTouchStart = (e) => {
        setTouchEnd(null); // reinicia el touchEnd
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (Math.abs(distance) < minSwipeDistance) return;

        if (distance > 0) {
            // Swipe hacia la izquierda: siguiente
            goToNext();
        } else {
            // Swipe hacia la derecha: anterior
            goToPrevious();
        }
    };

    return (
        <div className="relative flex items-center w-full p-4 overflow-hidden sm:rounded-xl">
            {/* Botón "Anterior" - Puedes mostrarlo u ocultarlo según convenga */}
            <button
                onClick={goToPrevious}
                className="absolute hidden sm:block left-2 bg-white hover:bg-gray-200 shadow-lg p-2 rounded-full z-10"
            >
                <FaAngleLeft size={25} />
            </button>

            {/* Contenedor del carrusel con eventos de touch */}
            <div
                className="w-full overflow-hidden relative"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${(currentIndex / itemsPerSlide) * 100}%)` }}
                >
                    {loading ? (
                        [...Array(itemsPerSlide)].map((_, i) => (
                            <div key={i} className="w-full sm:w-1/3 flex-shrink-0 text-center">
                                <div className="flex items-center justify-center gap-2 p-2 border rounded-lg animate-pulse w-full h-48">
                                    <div className="w-16 lg:w-48 lg:h-48 h-16 bg-gray-300 rounded-lg"></div>
                                    <p className="bg-gray-300 rounded-lg w-16 h-5"></p>
                                </div>
                            </div>
                        ))
                    ) : (
                        carouselItems.length > 0 &&
                        carouselItems.map((item, i) => (
                            <div key={i} className="w-full sm:w-1/3 flex-shrink-0 flex justify-center items-center p-1">
                                <div className="flex items-center justify-center gap-3 rounded-2xl p-2">
                                    <div className="w-24 lg:w-52 lg:h-52 h-24 rounded-lg">
                                        <img
                                            src={item.image}
                                            alt={`product-${i}`}
                                            className="w-full h-full object-scale-down"
                                        />
                                    </div>
                                    <div className="flex items-center flex-col gap-3">
                                        <p className="md:text-sm text-xs inline-block font-semibold bg-red-500 rounded-full text-white px-2">
                                            -{item.discount}%
                                        </p>
                                        <div className="md:text-sm text-xs inline-block font-semibold rounded-full text-green-500 px-2 cursor-pointer">
                                            <AddToCartButton data={item} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Botón "Siguiente" */}
            <button
                onClick={goToNext}
                className="absolute hidden sm:block right-2 bg-white hover:bg-gray-200 shadow-lg p-2 rounded-full z-10"
            >
                <FaAngleRight size={25} />
            </button>
        </div>
    );
};

export default Carousel;
