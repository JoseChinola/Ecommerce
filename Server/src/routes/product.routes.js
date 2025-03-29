import { Router } from 'express'
import auth from "../middleware/auth.js";
import {
    createProductController, deleteProductDetails,
    getProductByCategory, getProductByCategoryAndSubCategory,
    getProductController, getProductDetails,
    updateProductDetails
} from '../controllers/product.controller.js';

import { admin } from '../middleware/Admin.js';

const productRouter = Router()

productRouter.post("/create", auth, admin, createProductController)
productRouter.post("/get", getProductController)
productRouter.post("/get-product-categody", getProductByCategory)
productRouter.post("/get-product-category-and-subcategory", getProductByCategoryAndSubCategory)
productRouter.post("/get-product-details", getProductDetails)

//update product 
productRouter.put("/update-product-details", auth, admin, updateProductDetails)

//delete product 
productRouter.delete('/delete-product', auth, admin, deleteProductDetails)

export default productRouter