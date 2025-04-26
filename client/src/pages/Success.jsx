import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Success = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 8000); // 3 segundos

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 p-2 rounded z-50 bg-neutral-800 bg-opacity-70 flex items-center justify-center'>
            <div className='m-2 w-full max-w-md h-full max-h-52 bg-green-200 p-4 py-5 mx-auto flex flex-col justify-center items-center gap-4 rounded-md'>
                <p className='text-primary-Green font-bold text-lg text-center'>
                    {location?.state?.text || "Payment"} Exitosamente
                </p>
                <Link to="/" className='border border-primary-Green text-primary-Green hover:bg-primary-Green hover:text-white px-4 py-1 capitalize transition-all rounded-md'>
                    Ir a pagina principal
                </Link>
                <span className='text-sm text-gray-600'>(Redireccionando en 8 segundos...)</span>
            </div>
        </section>
    );
};

export default Success;
