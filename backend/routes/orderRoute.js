import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { createCODOrder, getAllOrders, getSalesData, updateOrderStatus } from "../controllers/orderController.js";
import { identifyCart } from "../middleware/cartIdentity.js";
const router = express.Router();

router.get('/all-orders',isAuthenticated,isAdmin,getAllOrders);
router.post("/cod", identifyCart, createCODOrder);
router.put("/:id", isAuthenticated, isAdmin, updateOrderStatus);
router.get("/sales",isAuthenticated,isAdmin,getSalesData);

export default router;
