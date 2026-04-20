import { Cart } from "../models/CartModel.js";
import { Product } from "../models/productModel.js";
import { ProductType } from "../models/productTypeModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataURI.js";

export const addProduct = async (req, res) => {
    try {
        let { productName, productDesc, productPrice, category, type, featured } = req.body;
        const userId = req.id;

        if (!productName || !productDesc || !productPrice || !category || !type) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        type = String(type).toLowerCase().trim();
        category = String(category).toLowerCase().trim();
        const reg = await ProductType.findOne({ type });
        if (reg && !reg.categories.includes(category)) {
            return res.status(400).json({ success: false, message: "Invalid category for selected type" });
        }

        // Handle multiple image uploads
        let productImg = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file);
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "hamza_products" // cloudinary folder name
                });

                productImg.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        }
        // create a product in DB
        const newProduct = await Product.create({
            userId,
            productName,
            productDesc,
            productPrice,
            category,
            type,
            featured: featured === 'true' || featured === true,
            productImg, // array of objects [{url, public_id},{url, public_id}]
        });

        return res.status(200).json({
            success: true,
            message: "Product created successfully",
            product: newProduct
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllProduct = async (_, res) => {
    try {
        const products = await Product.find();
        if (!products || products.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No product available",
                products: []
            });
        }

        return res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Delete images from cloudinary
        if (product.productImg && product.productImg.length > 0) {
            for (let img of product.productImg) {
                const result = await cloudinary.uploader.destroy(img.public_id);
            }
        }
        await Cart.updateMany(
            {},
            {
                $pull: {
                    items: { productId }
                }
            }
        );
        // Delete product from MongoDB
        await Product.findByIdAndDelete({_id:productId});
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        let { productName, productDesc, productPrice, category, type, existingImages, featured } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        const nextType = (type ? String(type).toLowerCase().trim() : product.type);
        const nextCategory = (category ? String(category).toLowerCase().trim() : product.category);
        if (nextType && nextCategory) {
            const reg2 = await ProductType.findOne({ type: nextType });
            if (reg2 && !reg2.categories.includes(nextCategory)) {
                return res.status(400).json({ success: false, message: "Invalid category for selected type" });
            }
        }

        let updatedImages = [];
        // keep selected old images
        if (existingImages) {
            const keepIds = JSON.parse(existingImages);
            updatedImages = product.productImg.filter((img) =>
                keepIds.includes(img.public_id)
            );

            //delete only removed images
            const removedImages = product.productImg.filter(
                (img) => !keepIds.includes(img.public_id)
            );
            for (let img of removedImages) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        } else {
            updatedImages = product.productImg; //keep all if nothing sent
        }
        // upload new images if any
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file);
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "hamza_products"
                });
                updatedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        }

        // update product
        product.productName = productName || product.productName;
        product.productDesc = productDesc || product.productDesc;
        product.productPrice = productPrice || product.productPrice;
        product.category = category ? String(category).toLowerCase().trim() : product.category;
        if (type) {
            product.type = String(type).toLowerCase().trim();
        }
        product.productImg = updatedImages;

        if (featured !== undefined) {
            product.featured = featured === 'true' || featured === true;
        }

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const toggleFeatured = async (req, res) => {
    try {
        const { productId } = req.params;
        const { featured } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        product.featured = featured;
        await product.save();

        return res.status(200).json({
            success: true,
            message: `Product ${featured ? 'marked as featured' : 'removed from featured'}`,
            product
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getFeaturedProducts = async (_, res) => {
    try {
        const products = await Product.find({ featured: true })
            .sort({createdAt:-1})
            .select('productName productPrice productImg.url _id')
            .slice('productImg.url', 1)
            .lean();
        return res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
