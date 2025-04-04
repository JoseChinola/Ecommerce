import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import userRouter from './routes/user.routes.js';
import { FRONTEND_URL } from './config.js';
import cookieParser from 'cookie-parser';
import categoryRouter from './routes/category.routes.js';
import uploadRouter from './routes/upload.routes.js';
import subCategoryRouter from './routes/subCategory.routes.js';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import "./models/associations.js";
import addressRouter from './routes/address.routes.js';
import orderRouter from './routes/order.routes.js';

const app = express();
app.use(cors({
    credentials: true,
    origin: FRONTEND_URL
}))
app.use(express.json());
app.use(cookieParser())
app.use(morgan("dev"));


app.get('/', (req, res) => {
    res.send('<h1>Welcomen</h1>')
})

app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/file', uploadRouter)
app.use("/api/subcategory", subCategoryRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/address", addressRouter)
app.use("/api/order", orderRouter)






export default app;