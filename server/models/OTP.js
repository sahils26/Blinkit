const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema= new mongoose.Schema({
    email:{
        type:String,
    },
    otp:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
})


async function sendVerificationEmail(email,otp){
    try{
        const mailResponse= await mailSender(email, "Verification Email By Blinkit_Sahil",otp);
        console.log("Email sent Successfully",mailResponse); 
    }
    catch(error){
        console.log("error occured while sending Mails",error);
        throw(error);
    }

}

OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})

module.exports=mongoose.model("OTP",OTPSchema);