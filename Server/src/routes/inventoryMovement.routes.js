import { Router } from 'express';
import auth from '../middleware/auth.js'
import { getInventoryMovementController } from '../controllers/inventoryMovement.controller.js';

const inventoryMovementRouter = Router()
inventoryMovementRouter.get('/gets-movement', auth, getInventoryMovementController)

export default inventoryMovementRouter