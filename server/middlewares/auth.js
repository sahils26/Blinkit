const jwt = require("jsonwebtoken")
require("dotenv").config();
const User = require("../models/User");



exports.auth = async(req,res,next) => {
    try{
        console.log("BEFORE TOKEN EXTRACTION");

        const token=req.body.token||
                    req.cookies.token||
                    req.header("Authorization").replace("Bearer ", "");

        console.log("AFTER TOKEN EXTRACTION");
                    
        if(!token){
            res.status(401).json({
                success:false,
                message:'Token missing'
            })
        }

        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            console.log(decode);
            req.user=decode;
            
        }catch(error){
            res.status(401).json({
                success:false,
                message:'invalid token'
            })
        }

        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success:false,
            message:'something went wrong  while validating the token'
        });
    }
}












exports.isStudent=async(req,res,next)=>{
    try{
        if(req.user.accountType !=="Student"){
            return res.status(401).json({
                success:false,
                message:'this is  a protected route for students only'
            })
        }
        next();

    }
    catch(error){
        res.status(500).json({
            success:false,
            message:'User role cannot be  verfied, try again'
        })
    }
}











exports.isAdmin=async(req,res,next)=>{
    try{
        console.log("Inside isAdmin middleware");
        if(req.user.accountType !=="Admin"){
            return res.status(401).json({
                success:false,
                message:'this is  a protected route for admins only'
            })
        }
        console.log("Exiting isAdmin middleware");
        next();

    }
    catch(error){
        res.status(500).json({
            success:false,
            message:'User role cannot be  verfied, try again'
        })
    }
}



