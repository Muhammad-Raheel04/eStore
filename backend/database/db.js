import mongoose  from "mongoose";
import { Cart } from "../models/CartModel.js";

const connectDB=async()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/eStore`);
        console.log("Mongodb connected successfully");
        try{
            // Ensure correct partial unique indexes for carts
            const indexes = await Cart.collection.indexes();
            const userIdx = indexes.find(ix => ix.name === 'userId_1');
            if (userIdx && (!userIdx.partialFilterExpression || !userIdx.unique)) {
                await Cart.collection.dropIndex('userId_1').catch(()=>{});
            }
            const sessionIdx = indexes.find(ix => ix.name === 'sessionId_1');
            if (sessionIdx && (!sessionIdx.partialFilterExpression || !sessionIdx.unique)) {
                await Cart.collection.dropIndex('sessionId_1').catch(()=>{});
            }
            await Cart.collection.createIndex(
                { userId: 1 },
                { unique: true, partialFilterExpression: { userId: { $exists: true, $type: "objectId" } } }
            ).catch(()=>{});
            await Cart.collection.createIndex(
                { sessionId: 1 },
                { unique: true, partialFilterExpression: { sessionId: { $exists: true, $type: "string" } } }
            ).catch(()=>{});
            console.log("Cart indexes ensured");
        }catch(err){
            console.log("Index ensure error:",err?.message);
        }
    }catch(error){
        console.log("Mongodb connection failed",error);
        
    }
}
export default connectDB
