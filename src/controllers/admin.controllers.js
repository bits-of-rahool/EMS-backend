import { Admin } from "../models/admin.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
const registerAdmin=asyncHandler(async(req,res)=>{

    const {name, password}=req.body
    if(
        [name,password].some((field)=> field?.trim()==="")
    ){
        throw new ApiError(400,"All fiedls are required")
    }

    const existedAdmin= await Admin.findOne({name})
    if(existedAdmin){
        throw new ApiError(409,"Admin with this name already exists")
    }
    console.log(req.body);
    const admin= await Admin.create({
        name,
        password
    })

    const createdAdmin=await Admin.findById(admin._id).select(
        "-password -refreshToken"
    )
    if(!createdAdmin){
        throw new ApiError(500,"Something went wrong while registering the Admin")
    }

    return res.status(201).json(
         {
            loginStatus:true
         }
    )

})
const loginAdmin=asyncHandler((async(req,res)=>{
    const {username, password}=req.body
    const existAdmin=await Admin.findOne({name:username});

    if(!existAdmin)throw new ApiError(404,"Admin not Found")

    const checkPassword=await existAdmin.isPasswordCorrect(password)
    if(!checkPassword)throw new ApiError(405,"Password is Incorrect")
    const token=jwt.sign({
        id:existAdmin.id,
        name:existAdmin.name,
    },process.env.JWT_TOKEN_SECRET,{
        expiresIn:process.env.JWT_TOKEN_EXPIRY
    })
    res.status(201)
    .cookie("username",existAdmin.name)
    .cookie("token",token)
    .json({loginStatus:true})
}))
export {registerAdmin, loginAdmin}