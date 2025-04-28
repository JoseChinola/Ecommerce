import React, { useState } from 'react'
import logomv from '../assets/logo.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../cammon/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const VerificarEmailPage = () => {
    const [status, setStatus] = useState('idle')
    const [message, setMessage] = useState('')
    const location = useLocation()
    const navigate = useNavigate()

    // Extraer `code` de query params
    const params = new URLSearchParams(location.search)
    const code = params.get('code')

    const volverInicio = () => navigate('/')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!code) {
            setStatus('error')
            setMessage('No se recibió código de verificación.')
            return
        }

        setStatus('loading')
        try {
            const res = await Axios({
                ...SummaryApi.verify_email,
                data: { code }
            })

            if (res.data.error) {
                setStatus('error')
                setMessage(res.data.message)
            } else {
                setStatus('success')
                setMessage(res.data.message)
                toast.success(res.data.message)
            }
        } catch (err) {
            AxiosToastError(err)
            setStatus('error')
            setMessage(err.response?.data?.message || 'Error interno.')
        }
    }

    return (
        <section className="w-full min-h-[80vh] flex items-center justify-center px-4">
            <div className="relative bg-white rounded-lg shadow-md w-full max-w-md p-6 text-center">
                <button
                    onClick={volverInicio}
                    className="absolute top-4 left-4 flex items-center bg-neutral-400 text-white p-2 rounded-md hover:bg-blue-700"
                >
                    <FaArrowLeft size={16} />
                    <span className="pl-1 text-sm">Inicio</span>
                </button>

                <h2 className="flex flex-col items-center justify-center mb-6 focus:ring-blue-500 font-semibold text-gray-900 w-full">
                    <img className="w-20 h-20" src={logomv} alt="logo" />
                    <span className="text-gray-500 font-bold pl-1">
                        <span className="text-primary-green font-bold pl-1 md:text-2xl">D’RAF SERVICES</span>
                    </span>
                </h2>


                {status === 'idle' && (
                    <form onSubmit={handleSubmit}>
                        <p className="mb-4 text-2xl font-bold italic text-gray-700">Verifica tu correo</p>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
                        >
                            Verificar correo
                        </button>
                    </form>
                )}

                {status === 'loading' && (
                    <p className="text-gray-500">Verificando correo…</p>
                )}

                {status === 'success' && (
                    <>
                        <FaCheckCircle size={48} className="text-green-600 mx-auto mb-2" />
                        <p className="text-green-700 font-semibold">{message}</p>
                        <Link
                            to="/login"
                            className="inline-block mt-4 text-white bg-green-800 hover:bg-green-600 py-2 px-4 rounded"
                        >
                            Iniciar sesión
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <FaTimesCircle size={48} className="text-red-600 mx-auto mb-2" />
                        <p className="text-red-700 font-semibold">{message}</p>
                        <button
                            onClick={volverInicio}
                            className="inline-block mt-4 text-white bg-gray-500 hover:bg-gray-700 py-2 px-4 rounded"
                        >
                            Volver al inicio
                        </button>
                    </>
                )}
            </div>
        </section>
    )
}

export default VerificarEmailPage