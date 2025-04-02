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
    const intervalRef = useRef(null);
    const itemsPerSlide = 3; // 🔹 Mostrar 3 imágenes a la vez

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

    useEffect(() => { fetchProductData(); }, []);

    useEffect(() => {
        if (carouselItems.length > 0) {
            startAutoScroll();
            return () => stopAutoScroll();
        }
    }, [carouselItems]);

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

    return (
        <div className="relative flex items-center w-full p-4 overflow-hidden">
            {/* 🔹 Botón "Anterior" */}
            <button
                onClick={goToPrevious}
                className="absolute left-2 bg-white hover:bg-gray-200 shadow-lg p-2 rounded-full z-10"
            >
                <FaAngleLeft size={25} />
            </button>

            {/* 🔹 Contenedor del carrusel */}
            <div className="w-full overflow-hidden relative">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${(currentIndex / itemsPerSlide) * 100}%)` }}
                >
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="w-1/3 flex-shrink-0 text-center">
                                <div className="flex items-center justify-center gap-2 p-2 border rounded-lg animate-pulse w-full h-48">
                                    <div className="w-16 lg:w-48 lg:h-48 h-16 bg-gray-300 rounded-lg"></div>
                                    <p className="bg-gray-300 rounded-lg w-16 h-5"></p>
                                </div>
                            </div>
                        ))
                    ) : (
                        carouselItems.length > 0 &&
                        carouselItems.map((item, i) => (
                            <div key={i} className="w-1/3 flex-shrink-0 flex justify-center items-center p-1">
                                <div className="flex items-center justify-center gap-3 border rounded-2xl p-2">
                                    <div className="w-16 lg:w-52 lg:h-52 h-16 rounded-lg">
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

            {/* 🔹 Botón "Siguiente" */}
            <button
                onClick={goToNext}
                className="absolute right-2 bg-white hover:bg-gray-200 shadow-lg p-2 rounded-full z-10"
            >
                <FaAngleRight size={25} />
            </button>
        </div>
    );
};

export default Carousel;
