import { ProductType } from "../models/productTypeModel.js";
import { Product } from "../models/productModel.js";

export const listTypes = async (_req, res) => {
    try {
        const types = await ProductType.find();
        return res.json({ success: true, types });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};

export const addType = async (req, res) => {
    try {
        const { type, categories } = req.body;
        if (!type) {
            return res.status(400).json({ success: false, message: "type is required" });
        }
        const doc = await ProductType.create({
            type: String(type).toLowerCase(),
            categories: Array.isArray(categories) ? categories : []
        });
        return res.json({ success: true, type: doc });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};

export const deleteType = async (req, res) => {
    try {
        const { typeName } = req.params;
        const t = String(typeName).toLowerCase();
        const inUse = await Product.exists({ type: t });
        if (inUse) {
            return res.status(400).json({ success: false, message: "Cannot delete a type that is used by products" });
        }
        await ProductType.deleteOne({ type: t });
        return res.json({ success: true, message: "Type removed" });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};

export const addCategoryToType = async (req, res) => {
    try {
        const { type, category } = req.body;
        if (!type || !category) {
            return res.status(400).json({ success: false, message: "type and category are required" });
        }
        const t = String(type).toLowerCase();
        const c = String(category).toLowerCase();
        const updated = await ProductType.findOneAndUpdate(
            { type: t },
            { $addToSet: { categories: c } },
            { upsert: true, new: true }
        );
        return res.json({ success: true, type: updated });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};

export const removeCategoryFromType = async (req, res) => {
    try {
        const { type, category } = req.params;
        const t = String(type).toLowerCase();
        const c = String(category).toLowerCase();
        const inUse = await Product.exists({ type: t, category: c });
        if (inUse) {
            return res.status(400).json({ success: false, message: "Cannot delete a category that is used by products" });
        }
        const updated = await ProductType.findOneAndUpdate(
            { type: t },
            { $pull: { categories: c } },
            { new: true }
        );
        return res.json({ success: true, type: updated });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};
