import express from 'express';
import { addProduct ,deleteProduct,getAllProduct, updateProduct, toggleFeatured, getFeaturedProducts, getProductById} from '../controllers/productController.js';
import { isAdmin, isAuthenticated } from '../middleware/isAuthenticated.js';
import { multipleUpload } from '../middleware/multer.js';


const router = express.Router();
router.post('/', isAuthenticated, multipleUpload,isAdmin, addProduct);
router.get('/getallproducts',getAllProduct);
router.get('/featured', getFeaturedProducts);
router.get('/:productId', getProductById);
router.delete('/delete/:productId', isAuthenticated, isAdmin, deleteProduct);
router.put("/update/:productId", isAuthenticated, isAdmin, multipleUpload, updateProduct);
router.patch("/featured/:productId", isAuthenticated, isAdmin, toggleFeatured);
export default router;