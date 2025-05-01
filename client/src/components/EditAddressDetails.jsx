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

const EditAddressDetails = ({ close, data }) => {
  const provinces = Object.keys(rdData)

  // calcular provincia inicial a partir del municipio guardado
  const initialProvince =
    provinces.find(p => rdData[p].municipios.includes(data.city)) ||
    provinces[0]

  // cargar ciudades principales y seleccionar la adecuada
  const headerCities = rdData[initialProvince].ciudades
  const initialHeaderCity = headerCities.includes(data.city)
    ? data.city
    : headerCities[0]

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      _id: data._id,
      userId: data.userId,
      address_line: data.address_line,
      headerCity: initialHeaderCity,
      municipio: data.city,
      pincode: data.pincode,
      country: data.country,
      mobile: data.mobile
    }
  })

  const { fetchAddress } = useGlobalContext()
  const watchedHeaderCity = watch('headerCity')

  const [municipios, setMunicipios] = useState([])
  const [pincodes, setPincodes]     = useState([])

  // Al montar o al cambiar headerCity, recargar municipios y códigos postales
  useEffect(() => {
    const prov = provinces.find(p =>
      rdData[p].ciudades.includes(watchedHeaderCity)
    )
    if (!prov) return

    console.log(prov)
    setMunicipios(rdData[prov].municipios)
    setPincodes(rdData[prov].codigos_postales)
    // no limpiamos selects para respetar defaultValues
  }, [watchedHeaderCity, provinces])

  const onSubmit = async vals => {
    try {
      const prov = provinces.find(p =>
        rdData[p].municipios.includes(vals.municipio)
      ) || watchedHeaderCity

      const payload = {
        _id: vals._id,
        userId: vals.userId,
        address_line: vals.address_line,
        city: vals.municipio,
        state: prov,
        pincode: vals.pincode,
        country: vals.country,
        mobile: vals.mobile
      }

      const resp = await Axios({
        ...SummaryApi.updateAddress,
        data: payload
      })
      if (resp.data.success) {
        toast.success(resp.data.message)
        close && close()
        reset()
        fetchAddress()
      }
    } catch (err) {
      AxiosToastError(err)
    }
  }

  return (
    <section className="bg-black fixed inset-0 z-50 bg-opacity-70 flex items-center overflow-auto p-4">
      <div className="bg-white p-4 w-full max-w-2xl mx-auto rounded-md">
        <div className="flex justify-between items-center border bg-blue-50 rounded-md px-2 py-1">
          <h2 className="font-semibold italic text-lg">Editar Dirección</h2>
          <button onClick={close} className="hover:text-red-600">
            <IoClose size={30}/>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 border p-2 rounded-lg">
          <div className="grid sm:grid-cols-2 gap-4">

            {/* Dirección */}
            <div className="relative">
              <label htmlFor="address_line">Dirección:</label>
              <input
                id="address_line"
                className="bg-blue-50 p-2 pl-10 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                {...register('address_line',{ required: "Requerido" })}
              />
              <FaAddressCard className="absolute left-3 top-9 text-gray-500"/>
              {errors.address_line && <p className="text-red-500 text-sm">{errors.address_line.message}</p>}
            </div>

            {/* Ciudad principal */}
            <div className="relative">
              <label htmlFor="headerCity">Ciudad principal:</label>
              <select
                id="headerCity"
                className="bg-blue-50 p-2 pl-10 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                {...register('headerCity',{ required: "Seleccione ciudad principal" })}
              >
                {headerCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <TbMapSearch className="absolute left-3 top-9 text-gray-500"/>
              {errors.headerCity && <p className="text-red-500 text-sm">{errors.headerCity.message}</p>}
            </div>

            {/* Municipio */}
            <div className="relative">
              <label htmlFor="municipio">Municipio:</label>
              <select
                id="municipio"
                className="bg-blue-50 p-2 pl-10 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                {...register('municipio',{ required: "Seleccione municipio" })}
              >
                {municipios.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <TbMapSearch className="absolute left-3 top-9 text-gray-500"/>
              {errors.municipio && <p className="text-red-500 text-sm">{errors.municipio.message}</p>}
            </div>

            {/* Código postal */}
            <div className="relative">
              <label htmlFor="pincode">Código postal:</label>
              <select
                id="pincode"
                className="bg-blue-50 p-2 pl-10 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                {...register('pincode',{ required: "Seleccione código postal" })}
              >
                {pincodes.map(cp => (
                  <option key={cp} value={cp}>{cp}</option>
                ))}
              </select>
              <TbMapPinCode className="absolute left-3 top-9 text-gray-500"/>
              {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode.message}</p>}
            </div>

            {/* País */}
            <div className="relative">
              <label htmlFor="country">País:</label>
              <input
                id="country"
                readOnly
                value="República Dominicana"
                className="bg-blue-50 p-2 pl-10 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                {...register('country',{ required: true })}
              />
              <SiOpenstreetmap className="absolute left-3 top-9 text-gray-500"/>
            </div>

            {/* Teléfono */}
            <div className="relative">
              <label htmlFor="mobile">Teléfono:</label>
              <input
                id="mobile"
                className="bg-blue-50 p-2 pl-10 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                {...register('mobile',{ required: "Requerido" })}
              />
              <CiMobile1 className="absolute left-3 top-9 text-gray-500"/>
              {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
            </div>

          </div>

          <button
            type="submit"
            className="mt-4 bg-primary-Green w-full py-2 font-semibold hover:bg-green-600 text-white rounded-md"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </section>
  )
}

export default EditAddressDetails
