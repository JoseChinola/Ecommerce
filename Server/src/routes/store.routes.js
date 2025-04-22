import { Router } from 'express'
import { addStoreController } from '../controllers/store.controller.js'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/Admin.js'


const storeRouter = Router()
storeRouter.post("/create", auth, admin, addStoreController)
// storeRouter.get("/get", auth, admin, createProductController)
// storeRouter.put("/update", auth, admin, createProductController)
// storeRouter.delete("/delete", auth, admin, createProductController)




export default storeRouter
