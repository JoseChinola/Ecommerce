import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from "helmet";
import dotenv from 'dotenv'
dotenv.config()
import userRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import categoryRouter from './routes/category.routes.js';
import uploadRouter from './routes/upload.routes.js';
import subCategoryRouter from './routes/subCategory.routes.js';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import addressRouter from './routes/address.routes.js';
import orderRouter from './routes/order.routes.js';
import storeRouter from './routes/store.routes.js';
import inventoryRouter from './routes/inventory.routes.js';
import "./models/associations.js";
import inventoryMovementRouter from './routes/inventoryMovement.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';

const app = express();


// app.options('*', cors({
//     origin: process.env.FRONTEND_URL,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//     optionsSuccessStatus: 200
// }));

// —————— 2. Aplica CORS a todas las peticiones ——————
app.use(cors({
    origin: process.env.FRONTEND_URL,
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    //allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    //optionsSuccessStatus: 200
}));


app.use(express.json());
app.use(cookieParser())
app.use(morgan("dev"));
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

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
app.use("/api/store", storeRouter)
app.use("/api/inventory", inventoryRouter)
app.use("/api/inventory-movement", inventoryMovementRouter)
app.use("/api", dashboardRouter)


export default app;