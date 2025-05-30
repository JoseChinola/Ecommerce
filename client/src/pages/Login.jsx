import React, { useEffect, useState } from 'react'
import logomv from '../assets/logo.png'
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { FaCheckCircle } from 'react-icons/fa';

const Login = () => {
    // Estado para almacenar los datos del formulario (email y contraseña)
    const [data, setData] = useState({
        email: "",
        password: "",
    })

    // Estado para mostrar u ocultar la contraseña
    const [showPassword, setShowPassword] = useState(false)

    // Estado para saber si se debe recordar el correo del usuario
    const [rememberMe, setRememberMe] = useState(false);

    // Estado para mostrar el mensaje de verificación de correo
    const [showVerifyEmailPrompt, setShowVerifyEmailPrompt] = useState(false);

    // Estado para indicar si el reenvío de correo fue exitoso
    const [resendSuccess, setResendSuccess] = useState(false)

    // Hooks de Redux y navegación
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Manejador del cambio en el checkbox "Remember me"
    const handleRememberMeChange = () => {
        setRememberMe(prev => !prev);
    };

    // Manejador de cambios en los inputs del formulario
    const handleChange = (e) => {
        const { name, value } = e.target

        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    // Valida si todos los campos están llenos
    const valideValue = Object.values(data).every(el => el)

    // Al cargar el componente, si el usuario eligió "remember me", se rellena el campo de email
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setData(prev => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    // Manejador del envío del formulario de login
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Llama al backend para hacer login
            const res = await Axios({
                ...SummaryApi.login,
                data: data
            });

            if (res.data.success) {
                // Si login exitoso: guarda tokens, obtiene datos del usuario, los guarda en redux y redirige
                toast.success(res.data.message);
                localStorage.setItem('accessToken', res.data.data.accessToken);
                localStorage.setItem('refreshToken', res.data.data.refreshToken);

                const userDetails = await fetchUserDetails();
                dispatch(setUserDetails(userDetails.data));

                if (rememberMe) {
                    localStorage.setItem("rememberedEmail", data.email);
                } else {
                    localStorage.removeItem("rememberedEmail");
                }

                setData({
                    email: "",
                    password: ""
                });

                navigate("/");
            }

        } catch (error) {
            // Si el correo no ha sido verificado, muestra mensaje especial
            if (error.response && error.response.data) {
                const message = error.response.data.message;
                toast.error(message);

                if (message.toLowerCase().includes("email") && message.toLowerCase().includes("verificado")) {
                    setShowVerifyEmailPrompt(true);
                }
            } else {
                AxiosToastError(error);
            }
        }
    };

    // Manejador para reenviar el correo de verificación
    const handleResendVerificationEmail = async () => {
        try {
            const { email } = data
            const res = await Axios({
                ...SummaryApi.resend_verification_email,
                data: { email }
            })

            if (res.data.error) {
                toast.error(res.data.message);
            }

            if (res.data.success) {
                toast.success("Correo de verificación reenviado");
                setResendSuccess(true);
            }
            else {
                toast.error(res.data.message || "Error al reenviar el correo");
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        // Sección principal del formulario
        <section className="w-full container mx-auto px-4 min-h-[80vh]">
            <div className="flex flex-col items-center justify-center mx-auto">
                <div className="w-full bg-white rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700">
                    <div className="p-4 space-y-3 md:space-y-3 sm:p-5">

                        <h2 className="flex flex-col items-center gap-1 justify-center font-semibold text-gray-900 w-full">
                            <img className="w-20 h-20" src={logomv} alt="logo" />
                            {/* Encabezado del formulario con logo y mensaje de bienvenida */}
                            {!showVerifyEmailPrompt ? (
                                <span className="text-gray-500 font-bold text-sm md:text-xl flex items-center flex-col gap-2">
                                    Bienvenido <Link to="/" className="text-primary-Green font-bold text-sm md:text-xl">D’RAF SERVICES</Link>
                                </span>
                            ) : (
                                <span className="text-gray-500 font-bold text-sm md:text-xl flex items-center flex-col gap-2 capitalize italic">
                                    Confirmar correo
                                </span>
                            )}
                        </h2>

                        {!showVerifyEmailPrompt ? (
                            /* Formulario principal (si no se requiere verificación de correo) */
                            <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
                                <div className='relative'>
                                    <label htmlFor="email"
                                        className="block mb-1 text-base font-semibold">
                                        Correo
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="bg-blue-50 p-2.5 pl-10 w-full border border-gray-300 
                                        rounded-md focus:outline-none 
                                           focus:ring-2 focus:ring-blue-500 peer"
                                        autoFocus
                                        value={data.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com" required="" />
                                    <MdOutlineMail size={22} className="absolute left-3 top-2/3 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />

                                </div>
                                <div className="relative">
                                    <label htmlFor="password" className="block mb-1 text-base font-semibold ">
                                        Contraseña
                                    </label>

                                    {/* Contenedor del input y los íconos */}
                                    <div className="relative">
                                        {/* Input */}
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            id="password"
                                            placeholder="••••••••"
                                            className="bg-blue-50 p-2.5 pr-10 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                                            required
                                            value={data.password}
                                            onChange={handleChange}
                                        />

                                        {/* Icono del candado */}
                                        <RiLockPasswordLine
                                            size={22}
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500"
                                        />

                                        {/* Icono del ojo para mostrar/ocultar contraseña */}
                                        <div
                                            onClick={() => setShowPassword(prev => !prev)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer peer-focus:text-blue-500"
                                        >
                                            {showPassword ? <FaRegEye size={22} /> : <FaRegEyeSlash size={22} />}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="remember"
                                                aria-describedby="remember"
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={handleRememberMeChange}
                                                className="w-4 h-4 border border-gray-300 rounded bg-blue-50 focus:ring-3 focus:ring-green-700"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="remember"
                                                className={`${rememberMe ? "text-gray-600" : "text-gray-300"}  font-semibold`}>
                                                Recuerdame
                                            </label>
                                        </div>
                                    </div>
                                    <Link to={"/forgot-password"} className="text-sm font-medium text-primary-600 
                                hover:underline hover:text-blue-700">
                                        ¿Has olvidado tu contraseña?
                                    </Link>
                                </div>

                                <button disabled={!valideValue} className={`${valideValue ? "bg-green-800 hover:bg-green-600" : "bg-gray-500"} w-full text-white py-2 rounded font-semibold mt-2 tracking-wide`}>
                                    Iniciar sesión
                                </button>

                                <p className="text-sm font-medium italic tracking-wide text-black flex flex-col md:flex-row">
                                    ¿No tienes cuenta? <Link to={"/register"} className="font-semibold ml-1 text-base hover:underline hover:text-blue-600 text-blue-800">Register</Link>
                                </p>
                            </form>
                        ) : (
                            /* Si el correo no está verificado, se muestra opción para reenviar */
                            <div className="space-y-4 text-center p-4 mx-auto container">
                                <p className="text-gray-700 text-sm md:text-lg">
                                    Tu correo electrónico aún no ha sido verificado.
                                </p>
                                {
                                    resendSuccess ? <div className='flex flex-col items-center text-green-600 text-lg'><FaCheckCircle size={48} className="mx-auto mb-2" /> Correo enviado.</div>
                                        : <button
                                            onClick={handleResendVerificationEmail}
                                            className="bg-green-800 hover:bg-green-600 w-fit px-3 text-white py-2 rounded-lg font-semibold mt-2 tracking-wide"
                                        >
                                            Reenviar correo de verificación
                                        </button>

                                }

                            </div>
                        )}


                    </div>
                </div>
            </div>
        </section >
    )
}

export default Login