import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    createCustomer,
    deleteCustomer,
    getAllCustomers,
    getCustomerByCustomerId,
    updateCustomer,
} from "../controllers/customer.controller.js";

const router = Router()

router.route("/create-customer").post( verifyJWT, createCustomer)
router.route("/customers").get( verifyJWT, getAllCustomers)
router.route("/customers/:customerId").get( verifyJWT, getCustomerByCustomerId)
router.route("/update-customer/:customerId").put( verifyJWT, updateCustomer)
router.route("/delete-customer/:customerId").delete( verifyJWT, deleteCustomer)

export default router