import express from 'express';
import 'dotenv/config';
import connectDB from './database/db.js';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js'
import cartRoute from './routes/cartRoute.js';
import orderRoute from './routes/orderRoute.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app=express();
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/user',userRoute);
app.use('/api/v1/product',productRoute);
app.use('/api/v1/cart',cartRoute);
app.use('/api/v1/order',orderRoute);
const PORT=process.env.PORT;
app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is listening at port ${PORT}`);

})
