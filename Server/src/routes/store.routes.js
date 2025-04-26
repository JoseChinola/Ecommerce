import { Router } from 'express'
import { addStoreController, deleteStoreController, getStoreController, updatewarehouseController } from '../controllers/warehouse.controller.js'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/Admin.js'


const storeRouter = Router()
storeRouter.post("/create", auth, admin, addStoreController)
storeRouter.get("/get", auth, admin, getStoreController)
storeRouter.put("/update", auth, admin, updatewarehouseController)
storeRouter.put("/delete", auth, admin, deleteStoreController)




export default storeRouter
