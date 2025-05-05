import { Router } from 'express';
import auth from '../middleware/auth.js'
import { getDashboardController } from '../controllers/dashboard.controller.js';


const dashboardRouter = Router()
dashboardRouter.get('/dashboard', auth, getDashboardController)

export default dashboardRouter