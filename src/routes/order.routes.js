import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
    createOrder,
    dashboardStats,
    deleteOrder,
    getAllOrders,
    getOrderByOrderId,
    updateOrder,
    updateOrderStatus
} from '../controllers/order.controller.js';


const router = Router()

router.route("/create-order").post(verifyJWT, createOrder)
router.route("/orders").get(verifyJWT, getAllOrders)
router.route("/order/:orderId").get(verifyJWT, getOrderByOrderId)
router.route("/update-order-status/:orderId/:userId/:customerId").put(verifyJWT, updateOrderStatus)
router.route("/delete-order/:orderId").delete(verifyJWT, deleteOrder)
router.route("/update-order/:orderId").put(verifyJWT, updateOrder)
router.route("/dashboard-stats").get(verifyJWT, dashboardStats)

export default router