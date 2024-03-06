import { Router } from "express";
import { deleteEmployee, editEmployee, registerEmployee, show, showAllEmployee, showCount } from "../controllers/employee.controllers.js";

const router=Router()

router.route("/register").post(registerEmployee)
router.route("/edit/:empID").put(editEmployee)
router.route("/delete/:empID").delete(deleteEmployee)
router.route("/show/:empID").get(show)
router.route("/employeeList").get(showAllEmployee)
router.route("/count").get(showCount)

export default router


