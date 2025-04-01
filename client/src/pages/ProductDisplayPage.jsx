import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../cammon/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP'
import Divider from '../components/Divider'
import { LiaCartPlusSolid } from "react-icons/lia";
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/bestPrice.png'
import image3 from '../assets/wiseAssortmen.png'
import ProductSkeleton from '../components/ProductSkeleton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'


const ProductDisplayPage = () => {
    const params = useParams()
    const [data, setData] = useState({
        name: "",
        image: [],
    })
    const [imageData, setImageData] = useState([])
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(false)

    const productParts = params?.product?.split("-");
    const productId = productParts?.slice(-5).join("-") || null;

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.getProductDetails,
                data: {
                    productId: productId
                }
            });

            const { data: resData } = response;

            if (resData.success) {
                // Asegurar que more_details siempre sea un objeto válido
                const moreDetails = typeof resData.data?.more_details === "string"
                    ? JSON.parse(resData.data.more_details)
                    : resData.data?.more_details || {};

                const images = resData.data?.image ? JSON.parse(JSON.parse(resData.data.image)) : [];

                // Guardar todo en el estado
                setData({ ...resData.data, more_details: moreDetails });
                setImageData(images);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetails()
    }, [params])

    if (loading) return <ProductSkeleton />;

    return (
        <section className='container mx-auto p-4 grid lg:grid-cols-2'>
            <div className=''>
                <div className='bg-white lg:min-h-[50vh] lg:max-h-[50vh] rounded-md min-h-56 max-h-56 w-full h-full'>
                    <img
                        src={imageData[selectedImageIndex]}
                        className='w-full h-full object-scale-down p-2'
                    />
                </div>

                <div className='flex items-center justify-center gap-3 my-3'>
                    {
                        imageData.map((img, index) => (
                            <div
                                key={img + index + "point"}
                                className={`bg-gray-300 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${index === selectedImageIndex ? "bg-green-300" : ""}`}
                            >
                            </div>
                        ))
                    }
                </div>

                <div className='grid relative'>
                    <div className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'>
                        {
                            imageData.map((img, index) => (
                                <div className='w-20 h-20 min-h-20 max-h-20  shadow-md cursor-pointer rounded-md bg-white' key={img + index}>
                                    <img
                                        src={img}
                                        alt='min-product'
                                        onClick={() => setSelectedImageIndex(index)}
                                        className='w-full h-full object-scale-down p-1'
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className='my-4 lg:grid gap-3 hidden'>
                    <div>
                        <p className='font-semibold'>Description</p>
                        <p className='text-sm'>{data.description}</p>
                    </div>

                    <div>
                        <p className='font-semibold'>Unit</p>
                        <p className='text-sm'>{data.unit}</p>
                    </div>
                    {
                        data?.more_details && Object.keys(data?.more_details).map((element, index) => {
                            return (
                                <div key={index + "moreDetails"}>
                                    <p className='font-semibold'>{element}</p>
                                    <p className='text-sm'>{data?.more_details[element]}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div className='p-1 lg:pl-8 text-base'>
                <p className='bg-green-300 w-fit rounded-full px-2 mb-1'>10 Min</p>
                <div className='flex gap-4 items-center'>
                    <h2 className='lg:text-3xl font-semibold capitalize'>{data.name}</h2>
                    <p className='bg-green-300 w-fit px-2 rounded-full text-center text-nowrap'>{data.unit}</p>
                </div>
                <Divider />
                <div className=''>
                    <p className='font-bold'>Price:</p>
                    <div className='flex items-center gap-4'>
                        <div className='border border-primary-Green px-2 rounded-md bg-green-200 w-fit'>
                            <p className='font-semibold text-lg text-center'> {DisplayPriceDOP(pricewithDiscount(data.price, data.discount))}</p>
                        </div>

                        {
                            Boolean(data.discount) && (
                                <p className='line-through'>{DisplayPriceDOP(data.price)}</p>
                            )
                        }

                        {
                            Boolean(data.discount) && (
                                <p className='font-bold text-red-500'>{data.discount}% <span className='text-sm text-neutral-500'>Discount</span></p>
                            )
                        }

                    </div>
                    {
                        data.stock === 0 ? (
                            <div className='my-3'>
                                <p className='text-lg text-red-500'>Out  of Stock</p>
                            </div>
                        ) : (
                            // <button className='my-4 lg:ml-4 px-8 py-1 bg-primary-Green hover:bg-green-700 text-white rounded-2xl'>
                            //     <LiaCartPlusSolid size={23} />
                            // </button>
                            <div className='my-4 w-36 text-xl'>
                                <AddToCartButton data={data} />
                            </div>
                        )
                    }
                </div>

                <div>
                    <h2 className='font-semibold'>Why shop fron ShopMix</h2>
                    <div>
                        <div className='flex items-center gap-4 my-3'>
                            <img
                                src={image1}
                                alt="Superfast delivery"
                                className='w-20 h-20'
                            />
                            <div className='text-sm'>
                                <div className='font-semibold'>Superfast Delivery</div>
                                <p>Get your orer delivered to you ddoorstep at the earliest from dark storesnear you. </p>
                            </div>
                        </div>

                        <div className='flex items-center gap-4 my-2'>
                            <img
                                src={image2}
                                alt="Best prices offers"
                                className='w-20 h-20'
                            />
                            <div className='text-sm'>
                                <div className='font-semibold capitalize'>Best Prices & Offers</div>
                                <p>
                                    Destination with the best prices and offers directly from the manufacturers.
                                </p>
                            </div>
                        </div>

                        <div className='flex items-center gap-4 my-3'>
                            <img
                                src={image3}
                                alt="Wide Assortment"
                                className='w-20 h-20'
                            />
                            <div className='text-sm'>
                                <div className='font-semibold capitalize'>Wide Assortment</div>
                                <p>
                                    Choose from over 5,000 products across clothing, personal care, home, and other categories.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/**only mobile */}
                <div className='my-4 grid gap-3 lg:hidden'>
                    <div>
                        <p className='font-semibold'>Description</p>
                        <p className='text-sm'>{data.description}</p>
                    </div>

                    <div>
                        <p className='font-semibold'>Unit</p>
                        <p className='text-sm'>{data.unit}</p>
                    </div>
                    {
                        data?.more_details && Object.keys(data?.more_details).map((element, index) => {
                            return (
                                <div key={index + "moreDetails"}>
                                    <p className='font-semibold'>{element}</p>
                                    <p className='text-sm'>{data?.more_details[element]}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default ProductDisplayPage