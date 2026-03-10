import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { addCategoryToType, addType, deleteType, listTypes, removeCategoryFromType } from "../controllers/typeController.js";

const router = express.Router();

router.get("/types", listTypes);
router.post("/type", isAuthenticated, isAdmin, addType);
router.delete("/type/:typeName", isAuthenticated, isAdmin, deleteType);
router.post("/category", isAuthenticated, isAdmin, addCategoryToType);
router.delete("/category/:type/:category", isAuthenticated, isAdmin, removeCategoryFromType);

export default router;
