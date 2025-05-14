import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerificarEmailPage from "../pages/VerifyEmailPage";
import VerifyEmailRegister from "./VerifyEmailRegister";
import MyOrders from "../pages/MyOrders";
import AdminOrders from "../pages/AdminOrders";

export const LoginRedirect = () => {
    const user = useSelector(state => state.user);

    if (user && user._id) {
        return <Navigate to="/" />;
    }
    return <Login />;
};

export const RegisterRedirect = () => {
    const user = useSelector(state => state.user);

    if (user && user._id) {
        return <Navigate to="/" />;
    }
    return <Register />;
};

export const VerifyEmailRedirect = () => {
    const user = useSelector(state => state.user);

    if (user && user._id) {
        return <Navigate to="/" />;
    }
    return <VerificarEmailPage />;
};


export const VerifyEmailRegisterRedirect = () => {
    const user = useSelector(state => state.user);

    if (user && user._id) {
        return <Navigate to="/" />;
    }

    return <VerifyEmailRegister />
}


export const ValidateUsersAdmin = () => {
    const user = useSelector(state => state.user);

    // 1. Si no hay usuario o no está logueado, le mandamos al home (o a login)
    if (!user || !user._id) {
        return <Navigate to="/" />;
    }

    // 2. Si está logueado pero NO es ni admin ni employee, mostramos sus pedidos
    if (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE') {
        return <MyOrders />;
    }

    // 3. Si llega hasta aquí, es admin o employee: mostramos el panel de administracion
    return <AdminOrders />;
};