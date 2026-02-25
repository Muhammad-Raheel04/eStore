import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { createCODOrder, getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
const router = express.Router();

router.get('/all-orders',isAuthenticated,isAdmin,getAllOrders);
router.post("/cod", isAuthenticated, createCODOrder);
router.put("/:id", isAuthenticated, isAdmin, updateOrderStatus);

export default router;