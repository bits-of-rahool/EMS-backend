import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { upload } from "./middleware/multer.middleware.js";

const app=express();

// app.use(cors());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
  }));
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(cookieParser())
app.use(express.static("public"))

//routes import
import adminRouter from "./routes/admin.routes.js"
import employeeRouter from "./routes/employee.routes.js"
import { verifyToken } from "./middleware/verifyJWT.middleware.js";
//routes declaration
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/employee",verifyToken,upload.single("imageLocalPath"),employeeRouter)

export {app};