import jwt from "jsonwebtoken"
const verifyToken = (req, res, next) => {
  
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json("Unauthorized Access")
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET); 
      req.user = decoded;
      
    } catch (error) {
      console.log(error);
      res.status(401).json({error});
    }
    next();
}

export {verifyToken}