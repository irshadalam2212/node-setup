import { Router } from "express";
import {
    loginUser,
    registerUSer,
    logoutUser,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    refreshAccessToken
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    registerUSer
)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/get-current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account-details").post(verifyJWT, updateAccountDetails)
router.route("/refresh-token").post(refreshAccessToken)

export default router