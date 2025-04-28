import { Router } from "express";
import auth from "../middleware/auth.js";
import { CashOnDeleveryOrderController, getOrderDetailsController, paymentController, stripeWebhook } from "../controllers/order.controller.js";

const orderRouter = Router()

orderRouter.post('/cash-on-delivery', auth, CashOnDeleveryOrderController)
orderRouter.post('/checkout', auth, paymentController)
orderRouter.post('/webhook', stripeWebhook)
orderRouter.get('/order-list', auth, getOrderDetailsController)

export default orderRouter