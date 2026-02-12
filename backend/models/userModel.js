import mongoose from 'mongoose';

const userSchema =new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        default:"" //Cloudinary image url
    },
    profilePicPublicId:{
        type:String,
        default:"" //Cloudinary public_id for deletion
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","admin"],
        defualt:"user"
    },
    token:{
        type:String,
        defualt:null
    },
    isVerified:{
        type:Boolean,
        defualt:false
    },
    token:{
        type:String,
        defualt:false
    },
    isLoggedIn:{
        type:Boolean,
        defualt:false
    },
    otp:{
        type:String,
        defualt:null
    },
    otpExpiry:{
        type:Date,
        default:null
    },
    address:{
        type:String,
    },
    city:{
        type:String
    },
    zipCode:{
        type:String
    },
    phoneNo:{
        type:String
    }
    
},{timestamps:true});

export const User=mongoose.model('User',userSchema);