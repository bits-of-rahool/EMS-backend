import mongoose from "mongoose";
import { Employee } from "../models/employee.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const registerEmployee=asyncHandler(async(req,res)=>{
    // res.status(200).json({message:"ok"})
    //get user detail from frontEnd
    //validation -not empty
    // check if user already exist : email
    //check for images
    //upload them to cloudinary(local)
    // create employee object - create entry in db
    // remove password and refresh token field from response
    //check for user creation
    // return res 

    const {name, email,mobile,designation,gender,course}=req.body
    if(
        [name,email,mobile,designation,gender,course].some((field)=> field?.trim()==="")
    ){
        throw new ApiError(400,"All fiedls are required")
    }

    const existedEmployee= await Employee.findOne({email})
    if(existedEmployee){
        throw new ApiError(409,"User with this email already exists")
    }


    const imageLocalPath=req.file?.filename;

    if(!imageLocalPath){
        throw new ApiError(400,"Image is Required")
    }
    const workUnder=new mongoose.Types.ObjectId(req.user.id);
    
    const employee= await Employee.create({
        name,
        email,
        mobile,
        designation,
        gender,
        course,
        workUnder,
        image:imageLocalPath,
    })

    

    const createdEmployee=await Employee.findById(employee._id).select(
        "-password -refreshToken"
    )
    if(!createdEmployee){
        throw new ApiError(500,"Something went wrong while registering the employee")
    }

    return res.status(201).json({Status:true})

})

const editEmployee=asyncHandler(async(req,res)=>{
    // employee/edit/:empID
    console.log(req.file);
    const findEmployee= await Employee.findById({_id:req.params.empID})
    if(!findEmployee)throw new ApiError(404,"User not Found")
    const {name, email,mobile,designation,gender,course}=req.body
    const updatedEmp={};
    if(name)updatedEmp.name=name;
    if(email)updatedEmp.email=email;
    if(mobile)updatedEmp.mobile=mobile; 
    if(designation)updatedEmp.designation=designation;
    if(gender)updatedEmp.gender=gender;
    if(course)updatedEmp.course=course;
    if(req.file){
      const imageLocalPath=req.file?.filename;
      updatedEmp.image=imageLocalPath
    }
    const updatedEmployee=await Employee.updateOne(findEmployee,updatedEmp,{new:true});

    return res.status(201).json(
        {Status:true}
    )  
})
const show=asyncHandler(async(req,res)=>{
    // employee/edit/:empID
    // console.log(req.params.empID);
    const findEmployee= await Employee.findById({_id:req.params.empID})

    return res.status(201).json(findEmployee
    )
})

const deleteEmployee=asyncHandler(async(req,res)=>{
    const deleteEmployee= await Employee.findOneAndDelete({_id:req.params.empID})
    if(!deleteEmployee)throw new ApiError(404,"User not Found")
    return res.status(201).json({Status:true}
    )
})

const showAllEmployee = asyncHandler(async (req, res) => {
    try {
      let { page = 1, limit = 10, sort, filter } = req.query;
      const skip = (page - 1) * limit;
      limit = Number(limit);
      let filterQuery = {};
      let sortQuery = { fullname: 1 }; // Adjust the field name for sorting as needed
  
      if (sort) {
        const sortingKey = sort.endsWith(':desc') ? sort.slice(0, -5) : sort;
        const sortOrder = sort.endsWith(':desc') ? -1 : 1;
        sortQuery = { [sortingKey]: sortOrder };
      }
      
      if (filter) {
        const filterObject = JSON.parse(filter);
        const key = Object.keys(filterObject)[0];
        const value = Object.values(filterObject)[0];
        
        const newQuery = {
          [key]: {
            $regex: value,
            $options: 'i',
          }
          
        };
        
        filterQuery = { ...newQuery};
        // console.log(filterQuery);
      }
      const id = new mongoose.Types.ObjectId(req.user.id);
  
      // console.log(id);

      const aggregationPipeline = [
          { $match: {"workUnder":id} },
          { $match: filterQuery },
          { $sort: sortQuery },
          { $skip: skip },
          { $limit: limit },
      ];
  
    //   console.log('ID:', id);
    //   console.log('Aggregation Pipeline:', aggregationPipeline);
      const employees = await Employee.aggregate(aggregationPipeline);
      res.json({Result:employees,Status:true});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

const showCount = asyncHandler(async (req, res) => {
    
      const id = new mongoose.Types.ObjectId(req.user.id);
  
      const aggregationPipeline = [
          { $match: {"workUnder":id} },
      ];

    //   console.log('ID:', id);
    //   console.log('Aggregation Pipeline:', aggregationPipeline);
      const employees = await Employee.aggregate(aggregationPipeline);
      const count = employees.length;
      res.json({Result: count,Status:true});
});

export {registerEmployee, editEmployee, deleteEmployee,showAllEmployee,showCount,show}