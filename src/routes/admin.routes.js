import { Router } from "express";
import { loginAdmin, registerAdmin } from "../controllers/admin.controllers.js";
import { verifyToken } from "../middleware/verifyJWT.middleware.js";

const router=Router()

router.route("/register").post(registerAdmin)
router.route("/login").post(loginAdmin)
router.route("/logout",verifyToken).post((req,res)=>{
    res.clearCookie('token')
    .clearCookie("username")
    .json({Status:true})
})
export default router