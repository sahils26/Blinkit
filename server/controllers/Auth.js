const User= require("../models/User");
const OTP=require("../models/OTP");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const otpGenerator=require("otp-generator");
require("dotenv").config();
const { uploadToCloudinary } = require("../utils/dataUploader");







exports.sendOTP=async(req,res)=>{
    
    try{
        const{email}=req.body;

		console.log("Cont111111111")

        const userPresent= await User.findOne({email});
        
        if(userPresent){
            return res.status(401).json({
                success:false,
                message:'User already exist'
            })
        }


        var otp= otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log(otp);


        const checkOTP= await OTP.findOne({otp: otp});

        while(checkOTP){
            otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });

            checkOTP= await OTP.findOne({otp:otp});
        }

        const otpBody=await OTP.create({email,otp});
        console.log(otpBody);


        res.status(200).json({
            success:true,
            message:'message sent Successfully',
            otp
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
    
};











exports.signup = async (req, res) => {
	try {
		// Destructure fields from the request body
		const {
			firstName,
			lastName,
			email,
			password,
			confirmPassword,
			otp,
		} = req.body;

		// Check if All Details are there or not
		if (
			!firstName ||
			!lastName ||
			!email ||
			!password ||
			!confirmPassword ||
			!otp
		) {
			return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
		}

		// Check if password and confirm password match
		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message:
					"Password and Confirm Password do not match. Please try again.",
			});
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists. Please log in to continue.",
			});
		}

		// Find the most recent OTP for the email
		const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        
		console.log(response);
		if (response.length === 0) {
			// OTP not found for the email
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid , otp is not found for the email",
			});
		} else if (otp !== response[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid, otp does not match",
			});
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);
	

		
		const user = await User.create({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${""}${lastName}`,
		});

		return res.status(200).json({
			success: true,
			user,
			message: "User registered successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
	}
};











// Login controller for authenticating users
exports.login = async (req, res) => {
	try {
		// Get email and password from request body
		const { email, password } = req.body;

		// Check if email or password is missing
		if (!email || !password) {
			// Return 400 Bad Request status code with error message
			return res.status(400).json({
				success: false,
				message: `Please Fill up All the Required Fields`,
			});
		}

		// Find user with provided email
		const user = await User.findOne({ email });

		// If user not found with provided email
		if (!user) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is not Registered with Us Please SignUp to Continue`,
			});
		}

		// Generate JWT token and Compare Password
		if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(
				{ email: user.email, id: user._id, accountType: user.accountType },
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);

			// Save token to user document in database
			user.token = token;
			user.password = undefined;
			// Set cookie for token and return success response
			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};
			res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user,
				message: `User Login Success`,
			});
		} else {
			return res.status(401).json({
				success: false,
				message: `Password is incorrect`,
			});
		}
	} catch (error) {
		console.error(error);
		// Return 500 Internal Server Error status code with error message
		return res.status(500).json({
			success: false,
			message: `Login Failure Please Try Again`,
		});
	}
};













exports.changePassword=async(req,res)=>{
    
    try{
        const{email,oldPassword,newPassword,confirmNewPassword}=req.body;

        if(!email || !oldPassword || !newPassword || !confirmNewPassword){
            return res.status(403).json({
                success:false,
                message:'All fields required'
            })
        }else if(newPassword !== confirmNewPassword){
            return res.status(400).json({
                success:false,
                message:'newPassword & confirmNewPassword do not match'
            })
        }

        

        const userExist=await User.findOne({email});
        if(await bcrypt.compare(oldPassword,userExist.password)){
            const hashedPass=bcrypt.hash(newPassword,10);


            //smaybe something's wrong here below
            const userData=await User.findOneAndUpdate({email:email},
                                                    {password:hashedPass},
                                                    {new:true}
            )

            return res.status(200).json({
                success:true,
                message:'password changes Successfully',
            })
        }else{
            return res.status(401).json({
                success:false,
                message:'Incorrect oldPassword'
            })
        }


    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"cannot change password, try again"
        })
    }
}




exports.uploadUserImage = async(req,res) => {
	try{
		const{userId}=req.user.id;
		const userImage = req.files.thumbnailImage

		const uploadedImage = await uploadToCloudinary(
			userImage,
			process.env.FOLDER_NAME
		  )

		  console.log("userImage",uploadedImage);


		const user = await User.findByIdAndUpdate({_id:userId},
										{
											$push:{image:uploadedImage.secure_url}
										},
										{new:true})
		

		res.status(200).json({
			success:true,
			message:"image uploaded successfully",
			data:user
		})							

	}catch(error){
		console.log(error);
		res.json({
			success:false,
			message:"could not upload image"
		})
	}
}
