const mongoose=require("mongoose");
require("dotenv").config();


exports.connectDB= () => {
    mongoose.connect(process.env.Database_Url,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=> console.log("DB Connected Successfully"))
    .catch((error)=>{
        console.log("DB connection Failed"),
        console.error(error),
        process.exit(1)
    })
};
