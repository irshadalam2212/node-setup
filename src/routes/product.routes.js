import { Router } from "express";
import { 
    createProduct, 
    deleteProduct, 
    getAllProducts, 
    getProductByProductId, 
    updateProduct 
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/create-product").post( verifyJWT, createProduct)
router.route("/update-product/:productId").put( verifyJWT, updateProduct)
router.route("/delete-product/:productId").delete( verifyJWT, deleteProduct)
router.route("/products").get( verifyJWT, getAllProducts)
router.route("/get-product/:productId").get( verifyJWT, getProductByProductId)


export default router