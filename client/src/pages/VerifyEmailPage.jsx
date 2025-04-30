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
    const [email, setEmail] = useState('')
    const [showEmailInput, setShowEmailInput] = useState(false)
    const [resendSuccess, setResendSuccess] = useState(false)
    const [correoYaVerificado, setCorreoYaVerificado] = useState(false)


    const location = useLocation()
    const navigate = useNavigate()

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

                setTimeout(() => {
                    navigate('/login')
                }, 4000)
            }
        } catch (err) {
            if (err?.response?.data?.message === "Correo verificado") {
                setCorreoYaVerificado(true)
                setMessage("Correo ya verificado. Redirigiendo a inicio de sesión...")

                setTimeout(() => {
                    navigate('/login')
                }, 3000)

                return
            }

            AxiosToastError(err)
            setStatus('error')
            setMessage(err.response?.data?.message || 'Error interno.')
        }
    }

    const handleResend = async () => {
        if (!email) {
            toast.error('Ingresa tu correo para reenviar el enlace.')
            return
        }

        setStatus('loading')
        try {
            const res = await Axios({
                ...SummaryApi.resend_verification_email,
                data: { email }
            })

            if (res.data.error) {
                setStatus('error')
                setMessage(res.data.message)
            } else {
                setStatus('idle')
                setEmail('')
                setResendSuccess(true)
                setShowEmailInput(false)
                toast.success(res.data.message || 'Correo reenviado correctamente.')
            }
        } catch (err) {
            AxiosToastError(err)
            setStatus('error')
            setMessage(err.response?.data?.message || 'Error al reenviar correo.')
        }
    }

    return (
        <section className="w-full min-h-[78vh] flex items-center justify-center px-4">
            <div className="relative bg-white rounded-lg shadow-md w-full max-w-md p-3 text-center">
                <div className='bg-secundary py-4 px-8 mx-auto rounded-xl'>
                    {correoYaVerificado ? (
                        <div className="text-center py-6">
                            <FaCheckCircle size={48} className="text-green-600 mx-auto mb-2" />
                            <p className="text-green-700 font-semibold">{message}</p>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={volverInicio}
                                className="absolute top-5 left-5 flex items-center bg-neutral-400 text-white py-1 px-2 rounded-md hover:bg-blue-700"
                            >
                                <FaArrowLeft size={16} />
                                <span className="pl-1 text-sm">Inicio</span>
                            </button>

                            <h2 className="flex flex-col items-center justify-center mb-4 font-semibold text-gray-900 w-full">
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
                                <p className="text-gray-500">Procesando...</p>
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
                                    {/* Ícono condicional */}
                                    {!showEmailInput && !resendSuccess && (
                                        <FaTimesCircle size={48} className="text-red-600 mx-auto mb-2" />
                                    )}
                                    {resendSuccess && (
                                        <FaCheckCircle size={48} className="text-green-600 mx-auto mb-2" />
                                    )}

                                    {status === 'error' && (
                                        <>
                                            <p className={`font-semibold mb-3 text-xl ${resendSuccess ? 'text-green-600' : 'text-red-600'}`}>
                                                {resendSuccess ? 'Correo enviado.' : message}
                                            </p>
                                        </>
                                    )}

                                    {/* Mostrar solo si NO fue reenvío exitoso */}
                                    {!resendSuccess && (
                                        !showEmailInput ? (
                                            <button
                                                onClick={() => {
                                                    setShowEmailInput(true)
                                                    setResendSuccess(false)
                                                    setMessage('Reenviar código')
                                                }}
                                                className="text-white bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded"
                                            >
                                                Reenviar correo
                                            </button>
                                        ) : (
                                            <div className=''>
                                                <div className="mb-4">
                                                    <input
                                                        type="email"
                                                        placeholder="Ingresa tu correo"
                                                        value={email}
                                                        onChange={(e) => {
                                                            setEmail(e.target.value)
                                                            setResendSuccess(false)
                                                        }}
                                                        className="w-full md:max-w-80 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleResend}
                                                    className="text-white bg-blue-600 hover:bg-blue-500 py-2 px-2 rounded-lg"
                                                >
                                                    Enviar enlace de verificación
                                                </button>
                                            </div>
                                        )
                                    )}
                                </>
                            )}
                        </>
                    )}

                </div>
            </div>
        </section>
    )
}

export default VerificarEmailPage