const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const Exam = require("../models/examModel");
const cloudinary = require('cloudinary');

// register
exports.register = catchAsyncErrors(
    async(req, res, next) => {
        const examIds = []
        const exams = await Exam.find();
        exams.forEach((exam) => {
           examIds.push({_id:exam._id});
        })
        const userId = req.body.userId;
        const password = req.body.password;
        
        if(!userId || !password){
            return next(new ErrorHandler("please enter userid and password",400));
        }
        const user = await User.create({userId,password,exams:examIds});
        return res.status(201).json({success:true,user})
    }
) 

// login user

exports.loginUser = catchAsyncErrors(
    async function(req, res, next) {
        const {userId,password} = req.body;
        // checking userid and password
        if(!userId || !password){
            return next(new ErrorHandler("please enter userid and password",400));
        }

        const user = await User.findOne({userId}).select("+password");

        if(!user){
            return next(new ErrorHandler("please enter valid userid and password",400));
        }

        const isPasswordMatched = await user.comparePassword(password);
        if(!isPasswordMatched){
            return next(new ErrorHandler("please enter valid userid and password",400));
        }
        sendToken(user,200,res)
    }
)

// logout user

exports.logout = catchAsyncErrors(
    async function(req, res, next){
        if(!req.cookies.token){
            return next(new ErrorHandler("not logged in",401))
        }
        res.cookie("token","",{
            expires: new Date(0),
            httpOnly: true
        });

        res.status(201).json({
            success:true,
            message:"logged out successfully"
        })
    }
)

// get all users --admin only

exports.allUsers = catchAsyncErrors(
    async function(req, res, next){
        const searchParams = {...req.body};
        const totalUsers = await User.countDocuments();
        if(Object.entries(searchParams).length===0){
            const users = await User.find().select("_id userId role avatar email mobile phone name");
            return res.status(200).json({success:true,users,totalUsers})
        }
        if(searchParams.search){
            const key = Object.keys(searchParams.search)[0];
            const value = searchParams.search[key];
            let obj = {[key]:{$regex:value,$options:"i"}}
            const users = await User.find(obj).select("_id userId role avatar email mobile phone name");
            return res.status(200).json({success:true,users,totalUsers})
        }
        if(searchParams.paginate){
            const page = searchParams.paginate.page || 1 ;
            const dataPerPage = searchParams.paginate.limit || 5
            const skip = dataPerPage * (page-1);
            const users = await User.find().select("_id userId role avatar email mobile phone name").limit(dataPerPage).skip(skip);
            return res.status(200).json({success:true,users,totalUsers})
        }
        if(searchParams.sort){
            const users = await User.find().select("_id userId role avatar email mobile phone name").sort({...searchParams.sort});
            return res.status(200).json({success:true,users,totalUsers})
        }
    }
)

exports.getuserdetails = catchAsyncErrors(
    async function(req, res, next){
        const user = await User.findById(req.user.id);
        if(!user){
            return next(new ErrorHandler("not found",404))
        }
        return res.status(200).json({sucess:true,user})
    }
)


exports.updatePassword = catchAsyncErrors(
    async function(req, res, next){
        const user = await User.findById(req.user.id).select("+password");
        
        const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

        if(!isPasswordMatched){
            return next(new ErrorHandler("password entered is wrong",400))
        }
        if(req.body.newPassword !== req.body.varifyPassword){
            return next(new ErrorHandler("password not matched",400))
        }

        user.password = req.body.newPassword;

        await user.save()

        sendToken(user,200,res)

    }
)

exports.getSingleUser = catchAsyncErrors(
    async function(req, res, next){
        const user = await User.findById(req.params.id);
        if(!user){
            return next(new ErrorHandler("user not found",400))
        }
        return res.status(200).json({success:true,user})
    }
)

exports.updateRole = catchAsyncErrors(
    async function(req, res, next){
        const {id} = req.params;
        const {role} = req.body;
        const foundUser = await User.findById(id);
        if(!foundUser){
            return next(new ErrorHandler("user not found",404))
        }
        if(foundUser.role === role){
            return next(new ErrorHandler(`role is already ${role}`,404))
        }
        const updatedUser = await User.findByIdAndUpdate(id,{role},{
            new:true,
            runValidators:true,
            useFindAndModify:false
        });

        return res.status(201).json({success:true,updatedUser})
    }
)


exports.updateUser = catchAsyncErrors(
    async function(req, res, next){
        if(req.user.id !== req.params.id){
            return next(new ErrorHandler("unauthorized user",401))
        }
        if(req.user.avatar.url.includes("cloudinary")){
            cloudinary.uploader.destroy(req.user.avatar.public_id, function(result) { console.log(result) });
        }
        let {name,email,mobile} = req.body;
        name = name.toLowerCase();
        const {avatar} = req.body;
        
        if(avatar){

            const myCloud = await cloudinary.v2.uploader.upload(avatar,{
                folder:"avatar",
                width:250,
                height:250,
                crop:"scale"
            })
            let obj = {name,email,mobile,avatar:{
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            }}
            name = name.toLowerCase();
            const user = await User.findByIdAndUpdate(req.params.id,obj,{
                new:true,
                runValidators:true,
                useFindAndModify:false
            });
            // console.log(user);
            return res.status(201).json({success:true,user})
        }
          
         const user = await User.findByIdAndUpdate(req.params.id,{name,email,mobile},{
             new:true,
             runValidators:true,
             useFindAndModify:false
         });
        //  console.log(user);
         return res.status(201).json({success:true,user})

    }
)

exports.deleteUser = catchAsyncErrors(
    async function(req, res, next){
        
        const {id} = req.params;
        const user = await User.findById(id);
        const avatarUrl = user.avatar.url;
        const avatarId = user.avatar.public_id;
        const isAvatarUrl  = avatarUrl.includes("cloudinary");
        if(isAvatarUrl){
            cloudinary.uploader.destroy(avatarId, function(result) { console.log(result) });
        }
        const deleted = await User.findByIdAndDelete(id);
        if(!deleted){
            return next(new ErrorHandler("not found",400))
        }
        return res.status(201).json({success:true,deleted})
    }
)