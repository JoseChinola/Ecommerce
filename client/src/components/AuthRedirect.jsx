import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerificarEmailPage from "../pages/VerifyEmailPage";
import VerifyEmailRegister from "./VerifyEmailRegister";

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
