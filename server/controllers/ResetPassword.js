const User=require("../models/User");
const bcrypt=require("bcrypt")


exports.resetPasswordToken= async(req,res)=> {
    try{
        const email=req.body.email;

        const user= await User.findOne({email:email});

        if(!user){
            return res.json({
                success:false,
                message:'Email not registered '
            })
        }

        const token=crypto.randomUUID();

        const updatedData= await User.findOneAndUpdate({email:email},
                                                        {
                                                            token:token,
                                                            resetPasswordToken:Date.now()+5*60*1000,
                                                        })


        const url=`http://localhost:3000/update-password/${token}`;

        await mailSender(email,'RESET PASSWORD',`RESET PASSWORD LINK-${url}`);
        

        return res.json({
            success:true,
            message:'Email send Successfully, check email to send Password'
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:'something went wrong while resetting password'
        })
    }
}










exports.resetPassword = async(req,res)=>{
    try{
        const {token,password,confirmPassword}=req.body;
        
        if(password!=confirmPassword){
            return res.json({
                success:false,
                message:'passwords do not match',
            })
        }

        const userData=await User.findOne({token:token});

        if(!userData){
            return res.json({
                success:false,
                message:'invalid token'
            })
        }else if(userData.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:'Token expired'
            })
        }


        const hashedPass= bcrypt.hash(password,10);

        await User.findOneAndUpdate({token:token},
                                    {password:hashedPass},
                                    {new:true}
                                    )

        res.status(200).json({
            success:true,
            message:'Password reset Successfully'
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:'something went wrong while resetting password'
        })
    }
}