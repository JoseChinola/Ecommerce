import React from 'react'
import logomv from '../assets/logo.png'
import { FaEnvelopeOpenText } from 'react-icons/fa'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const VerifyEmailRegister = () => {
    const user = useSelector(state => state.user);

    if (user || user._id) {
        return <Navigate to="/" />;
    }


    return (
        <section className="w-full min-h-[78vh] flex items-center justify-center px-4">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-4 text-center">
                <div className='flex items-center mb-4 justify-center flex-col'>
                    <img src={logomv} alt="Logo" className="w-24 h-24" />
                    <h3 className='text-base font-bold'>
                        D’RAF SERVICES
                        <span className='hidden lg:flex text-sm italic font-medium'>
                            SERVIRTE ES NUESTRO COMPROMISO
                        </span>
                    </h3>
                </div>
                <FaEnvelopeOpenText size={48} className="text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">¡Registro Exitoso!</h2>
                <p className="text-gray-700 mb-6">
                    Gracias por registrarte. Por favor, revisa tu correo electrónico y haz clic en el
                    enlace que te hemos enviado para confirmar tu cuenta.
                </p>
            </div>
        </section>
    )
}

export default VerifyEmailRegister