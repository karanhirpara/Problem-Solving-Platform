const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("../utils/asyncHandler.js");
const JWT = require("jsonwebtoken")
const User = require("../models/user.model.js")
const verifyuser = asyncHandler(async(req,res,next)=>{
 
   try {
     const AccessToken = req.cookies?.AccessToken || req.handler("AccessToken")?.replace("Bearer ","")
     
     if(!AccessToken){
          throw new ApiError(404,"AccessToken error")
     }
     
     const checkaccesstoken = JWT.verify(AccessToken,process.env.ACCESS_TOKEN_SECRET);

    
     
     const user = await User.findById(checkaccesstoken._id).
                    select("-password -refreshToken")
     if(!user){
          throw new ApiError(400,"user not found");
     }
     
     
     req.user = user;

     next();

   } catch (error) {
    throw new ApiError(404,"AccessToken error");
    
   }
})

module.exports = verifyuser;