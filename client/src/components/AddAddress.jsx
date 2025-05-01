import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { FaAddressCard } from "react-icons/fa"
import { TbMapSearch, TbMapPinCode } from "react-icons/tb"
import { SiOpenstreetmap } from "react-icons/si"
import { useGlobalContext } from '../provider/useGlobalContext'
import Axios from '../utils/Axios'
import SummaryApi from '../cammon/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { IoClose } from 'react-icons/io5'
import { CiMobile1 } from "react-icons/ci"
import rdData from '../utils/rdData'

const AddAddress = ({ close }) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm()
    const { fetchAddress } = useGlobalContext()

    // Build array of all cities from rdData
    const provinces = Object.keys(rdData)
    const allCities = provinces.flatMap(prov => rdData[prov].ciudades)

    const selectedCity = watch('city')
    const [municipios, setMunicipios] = useState([])
    const [pincodes, setPincodes] = useState([])

    // When user selects a city, determine its province and load municipios & pincodes
    useEffect(() => {
        if (!selectedCity) {
            setMunicipios([])
            setPincodes([])
            setValue('state', '')
            setValue('municipio', '')
            setValue('pincode', '')
            return
        }
        // Find province for this city
        const prov = provinces.find(p =>
            rdData[p].ciudades.includes(selectedCity)
        )
        // Set hidden state field for submission
        setValue('state', prov || '')
        // Populate municipios & codigos_postales for that province
        if (prov) {
            setMunicipios(rdData[prov].municipios)
            setPincodes(rdData[prov].codigos_postales)
            // reset dependent selects
            setValue('municipio', '')
            setValue('pincode', '')
        }
    }, [selectedCity, provinces, setValue])

    const onSubmit = async data => {
        try {
            await Axios({
                ...SummaryApi.createAddress,
                data: {
                    address_line: data.addressline,
                    city: data.city,
                    state: data.state,       // hidden field
                    pincode: data.pincode,
                    country: data.country,
                    mobile: data.mobile
                }
            })
            toast.success("Address added")
            close && close()
            reset()
            fetchAddress()
        } catch (err) {
            AxiosToastError(err)
        }
    }

    return (
        <section className='bg-black fixed inset-0 z-50 bg-opacity-70 flex items-center overflow-auto p-4'>
            <div className='bg-white p-4 w-full max-w-2xl mx-auto rounded-md'>
                <div className='flex justify-between items-center border bg-blue-50 rounded-md px-2 py-1'>
                    <h2 className='font-semibold italic text-lg'>Añadir Dirección</h2>
                    <button onClick={close} className="hover:text-red-600">
                        <IoClose size={30} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className='mt-4 grid gap-4 border p-2 rounded-lg'>
                    {/* Hidden state/province field */}
                    <input type="hidden" {...register('state', { required: true })} />

                    <div className='grid sm:grid-cols-2 gap-4'>
                        {/* Address Line */}
                        <div className='relative'>
                            <label>Dirección:</label>
                            <input
                                className='bg-blue-50 p-2 pl-10 w-full border rounded-md focus:ring-2 focus:ring-blue-500'
                                {...register('addressline', { required: "Required" })}
                            />
                            <FaAddressCard className="absolute left-3 top-9 text-gray-500" />
                            {errors.addressline && <p className="text-red-500 text-sm">{errors.addressline.message}</p>}
                        </div>

                        {/* City */}
                        <div className='relative'>
                            <label>Ciudad:</label>
                            <select
                                className='bg-blue-50 p-2 pl-10 w-full border rounded-md focus:ring-2 focus:ring-blue-500'
                                {...register('city', { required: "Select city" })}
                            >
                                <option value="">Selecciona ciudad</option>
                                {allCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                            <TbMapSearch className="absolute left-3 top-9 text-gray-500" />
                            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                        </div>

                        {/* Municipio */}
                        <div className='relative'>
                            <label>Municipio:</label>
                            <select
                                className='bg-blue-50 p-2 pl-10 w-full border rounded-md focus:ring-2 focus:ring-blue-500'
                                {...register('municipio', { required: "Select municipio" })}
                            >
                                <option value="">Seleccione municipio</option>
                                {municipios.map(mun => (
                                    <option key={mun} value={mun}>{mun}</option>
                                ))}
                            </select>
                            <TbMapSearch className="absolute left-3 top-9 text-gray-500" />
                            {errors.municipio && <p className="text-red-500 text-sm">{errors.municipio.message}</p>}
                        </div>

                        {/* Pincode */}
                        <div className='relative'>
                            <label>Codigo Postal:</label>
                            <select
                                className='bg-blue-50 p-2 pl-10 w-full border rounded-md focus:ring-2 focus:ring-blue-500'
                                {...register('pincode', { required: "Select pincode" })}
                            >
                                <option value="">Seleccionar Postal</option>
                                {pincodes.map(cp => (
                                    <option key={cp} value={cp}>{cp}</option>
                                ))}
                            </select>
                            <TbMapPinCode className="absolute left-3 top-9 text-gray-500" />
                            {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode.message}</p>}
                        </div>

                        {/* Country */}
                        <div className='relative'>
                            <label>Pais:</label>
                            <input
                                readOnly
                                value="Dominican Republic"
                                className='bg-blue-50 p-2 pl-10 w-full border rounded-md focus:ring-2 focus:ring-blue-500'
                                {...register('country', { required: true })}
                            />
                            <SiOpenstreetmap className="absolute left-3 top-9 text-gray-500" />
                        </div>

                        {/* Mobile */}
                        <div className='relative'>
                            <label>Numero de Movil:</label>
                            <input
                                className='bg-blue-50 p-2 pl-10 w-full border rounded-md focus:ring-2 focus:ring-blue-500'
                                {...register('mobile', { required: "Required" })}
                            />
                            <CiMobile1 className="absolute left-3 top-9 text-gray-500" />
                            {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='mt-4 bg-primary-Green w-full py-2 font-semibold hover:bg-green-600 text-white rounded-md'
                    >
                        Agregar
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AddAddress