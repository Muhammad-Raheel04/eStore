import mongoose  from "mongoose";
import { Cart } from "../models/CartModel.js";
import { Product } from "../models/productModel.js";
import { ProductType } from "../models/productTypeModel.js";

const connectDB=async()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/eStore`);
        console.log("Mongodb connected successfully");
        try{
            await Product.updateMany(
                { $or: [{ type: { $exists: false } }, { type: null }, { type: "" }] },
                { $set: { type: "unisex" } }
            );
            console.log("Backfilled product.type for legacy documents");
        }catch(err){
            console.log("Backfill error:",err?.message);
        }
        try{
            // Seed initial types & categories if collection empty
            const count = await ProductType.countDocuments();
            if (count === 0) {
                const initial = [
                    { type: "men", categories: ["shirts","pants","shoes","watches"] },
                    { type: "women", categories: ["dresses","heels","bags","jewelry"] },
                    { type: "kids", categories: ["toys","school-wear","kids-shoes"] },
                    { type: "unisex", categories: ["hoodies","caps"] },
                ];
                await ProductType.insertMany(initial);
                console.log("Seeded ProductType registry");
            }
        }catch(err){
            console.log("Seeding ProductType error:", err?.message);
        }
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
