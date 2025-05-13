import { Router } from 'express'
import cors from 'cors';
import auth from "../middleware/auth.js";
import { admin } from '../middleware/Admin.js';
import {
    createProductController, deleteProductDetails,
    getProductByCategory, getProductByCategoryAndSubCategory,
    getProductController, getProductDetails,
    searchProduct,
    updateProductDetails
} from '../controllers/product.controller.js';


const productRouter = Router()

// 1) Aplica CORS sólo a este router (reforzamos la configuración global)
productRouter.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// 2) Maneja el preflight OPTIONS para **todas** las rutas de este router
productRouter.options('*', (req, res) => {
    res
        .header('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
        .header('Access-Control-Allow-Methods', 'POST,PUT,DELETE,OPTIONS')
        .header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        .header('Access-Control-Allow-Credentials', 'true')
        .sendStatus(200);
});

productRouter.post("/create", auth, admin, createProductController)
productRouter.post("/get", getProductController)
productRouter.post("/get-product-categody", getProductByCategory)
productRouter.post("/get-product-category-and-subcategory", getProductByCategoryAndSubCategory)
productRouter.post("/get-product-details", getProductDetails)

//update product 
productRouter.put("/update-product-details", auth, admin, updateProductDetails)

//delete product 
productRouter.delete('/delete-product', auth, admin, deleteProductDetails)

//seach product 
productRouter.post('/search-product', searchProduct)


export default productRouter