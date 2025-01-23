import { Router } from "express";
import {
    loginUser,
    registerUSer,
    logoutUser
} from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(
    registerUSer
)

router.route("/login").post(loginUser)
router.route("/logout").post(logoutUser)

export default router