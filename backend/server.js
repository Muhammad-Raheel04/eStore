import express from 'express';
import 'dotenv/config';
import connectDB from './database/db.js';
import userRoute from './routes/userRoute.js';

const app=express();
app.use(express.json());
app.use('/api/v1/user',userRoute);

const PORT=process.env.PORT;
app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is listening at port ${PORT}`);

})