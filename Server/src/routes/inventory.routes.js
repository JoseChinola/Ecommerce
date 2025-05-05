import { Router } from 'express'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/Admin.js'
import { addInventoryController, getInventoryController, updateInventoryController } from '../controllers/inventory.controller.js'


const inventoryRouter = Router()
inventoryRouter.post("/create", auth, admin, addInventoryController)
inventoryRouter.get("/get", auth, getInventoryController)
inventoryRouter.put("/update", auth, admin, updateInventoryController)

export default inventoryRouter
