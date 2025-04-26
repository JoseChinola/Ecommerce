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

    // Swipe state
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    // Fetch products with discount
    const fetchProductData = async () => {
        try {
            setLoading(true);
            const resp = await Axios({
                ...SummaryApi.getProduct,
                data: { page: 1, limit: 12 },
            });
            const { data: resData } = resp;
            if (resData.success) {
                const discountedProducts = resData.data.filter(p => p.discount > 0);
                const items = discountedProducts.map(product => {
                    const images = product.image ? JSON.parse(product.image) : [];
                    const stock = Array.isArray(product.inventoryData)
                        ? product.inventoryData.reduce((sum, inv) => sum + (inv.stock || 0), 0)
                        : Array.isArray(product.inventories)
                            ? product.inventories.reduce((sum, inv) => sum + (inv.stock || 0), 0)
                            : 0;
                    return {
                        image: images[0] || null,
                        discount: product.discount,
                        name: product.name,
                        _id: product._id,
                        stock,
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

    // Adjust items per slide on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsPerSlide(1);
            else setItemsPerSlide(3);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch carousel items once
    useEffect(() => {
        // call fetchProductData without returning a promise
        fetchProductData();
    }, []);

    // Auto scroll effect
    useEffect(() => {
        if (carouselItems.length > 0) {
            startAutoScroll();
            return () => stopAutoScroll();
        }
    }, [carouselItems, itemsPerSlide]);

    const startAutoScroll = () => {
        stopAutoScroll();
        intervalRef.current = setInterval(goToNext, 4000);
    };

    const stopAutoScroll = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const goToNext = () => {
        stopAutoScroll();
        setCurrentIndex(prev => (prev + itemsPerSlide) % carouselItems.length);
        startAutoScroll();
    };

    const goToPrevious = () => {
        stopAutoScroll();
        setCurrentIndex(prev => (prev - itemsPerSlide + carouselItems.length) % carouselItems.length);
        startAutoScroll();
    };

    // Touch handlers
    const onTouchStart = e => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
    const onTouchMove = e => setTouchEnd(e.targetTouches[0].clientX);
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (Math.abs(distance) < minSwipeDistance) return;
        distance > 0 ? goToNext() : goToPrevious();
    };

    return (
        <div className="relative flex items-center w-full p-4 overflow-hidden sm:rounded-xl">
            <button onClick={goToPrevious} className="absolute hidden sm:block left-2 bg-white hover:bg-gray-200 shadow-lg p-2 rounded-full z-10">
                <FaAngleLeft size={25} />
            </button>

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
                        ))) : (
                        carouselItems.map((item, i) => (
                            <div key={i} className="w-full sm:w-1/3 flex-shrink-0 flex flex-col items-center p-1">
                                <div className="w-24 lg:w-52 lg:h-52 h-24 rounded-lg overflow-hidden">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="mt-2 text-center">
                                    <p className="font-semibold text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-600">cantidad: {item.stock}</p>
                                </div>
                                <div className="mt-1 flex items-center gap-2">

                                    {item.stock > 0 ? (
                                        <>
                                            <span className="inline-block font-semibold text-xs bg-red-500 text-white rounded-full px-1 py-1">
                                                -{item.discount}%
                                            </span>
                                            <AddToCartButton data={item} fetchProductData={fetchProductData} />
                                        </>
                                    ) : (
                                        <span className="text-red-500 text-xs">Agotado</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <button onClick={goToNext} className="absolute hidden sm:block right-2 bg-white hover:bg-gray-200 shadow-lg p-2 rounded-full z-10">
                <FaAngleRight size={25} />
            </button>
        </div>
    );
};

export default Carousel;
