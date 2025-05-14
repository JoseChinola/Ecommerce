import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import Profile from "../pages/Profile";
import Dashboard from "../layouts/Dashboard";
import Address from "../pages/Address";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermissions from "../layouts/AdminPermissions";
import { LoginRedirect, RegisterRedirect, ValidateUsersAdmin, VerifyEmailRedirect, VerifyEmailRegisterRedirect } from "../components/AuthRedirect";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CartMobile from "../pages/CartMobile";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import Inventario from "../layouts/Inventario";
import Warehouse from "../layouts/Warehouse";
import InventoryMovements from "../pages/InventoryMovements";
import UsersPage from "../pages/UsersPage";


const Router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "search",
                element: <SearchPage />
            },
            {
                path: "login",
                element: <LoginRedirect />
            },
            {
                path: "register",
                element: <RegisterRedirect />
            },
            {
                path: "verify-email-register",
                element: <VerifyEmailRegisterRedirect />
            }
            ,
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "verification-otp",
                element: <OtpVerification />
            },
            {
                path: "reset-password",
                element: <ResetPassword />
            },
            {
                path: "dashboard",
                element: <AdminPermissions><Dashboard /></AdminPermissions>
            },
            {
                path: "warehouse",
                element: < AdminPermissions > <Warehouse /></ AdminPermissions>
            },
            {
                path: "inventory",
                element: < AdminPermissions > <Inventario /></ AdminPermissions>
            },
            {
                path: "inventory-movements",
                element: <AdminPermissions > <InventoryMovements /></ AdminPermissions>
            },
            {
                path: "profile",
                element: <Profile />
            },
            {
                path: "myorders",
                element: <ValidateUsersAdmin />
            },
            {
                path: "address",
                element: <Address />
            },
            {
                path: "category",
                element: <AdminPermissions><CategoryPage /></AdminPermissions>
            },
            {
                path: "subcategory",
                element: <AdminPermissions><SubCategoryPage /></AdminPermissions>
            },           
            {
                path: "product",
                element: <AdminPermissions><ProductAdmin /></AdminPermissions>
            },
            {
                path: "product",
                element: <AdminPermissions><ProductAdmin /></AdminPermissions>
            },
            {
                path: "users",
                element: <AdminPermissions><UsersPage /></AdminPermissions>
            },
            {
                path: ":category",
                children: [
                    {
                        path: ":subCategory",
                        element: <ProductListPage />
                    }
                ]
            },
            {
                path: "product/:product",
                element: <ProductDisplayPage />
            },
            {
                path: "cart",
                element: <CartMobile />
            },
            {
                path: "checkout",
                element: <CheckoutPage />
            },
            {
                path: "success",
                element: <Success />
            },
            {
                path: "cancel",
                element: <Cancel />
            },
            {
                path: "verify-email",
                element: <VerifyEmailRedirect />
            },
        ]
    }
])



export default Router;