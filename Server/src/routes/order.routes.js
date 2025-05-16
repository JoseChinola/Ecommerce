import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from '../middleware/Admin.js';
import { cancelOrderController, CashOnDeleveryOrderController, getGroupedOrdersByUserController, getOrderDetailsController, paymentController, stripeWebhook, updateOrderStatusController } from "../controllers/order.controller.js";

const orderRouter = Router()

orderRouter.post('/cash-on-delivery', auth, CashOnDeleveryOrderController)
orderRouter.post('/checkout', auth, paymentController)
orderRouter.post('/webhook', stripeWebhook)
orderRouter.get('/order-list', auth, getOrderDetailsController)

// Ruta protegida para admin: actualizar estado del pedido
orderRouter.patch('/order-status', auth, admin, updateOrderStatusController);
orderRouter.get('/all-orders', auth, admin, getGroupedOrdersByUserController);
orderRouter.put('/cancel-order', auth, cancelOrderController);



export default orderRouter