const mongoose = require('mongoose');
const UserModel = require('../models/user');
const OTPModel = require('../models/otp')
const sendMailUtility = require('../utils/sendEmailUtility')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {add} = require("nodemon/lib/rules");
const {ObjectId} = mongoose.Schema;
exports.healthCheck = async (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            data: "API is working fine",
        });
    } catch (err) {
        res.status(500).json({
            status: "fail",
            data: err,
        });
    }
};



exports.registration = async (req, res)=>{

    try{
        if(!req.body.firstName.trim()){
            return res.status(400).json({
                status: 'fail',
                data: "First Name is required"
            });
        }
        if(!req.body.email){
            return res.status(400).json({
                status: 'fail',
                data: "Email is required"
            });
        }
        if(!req.body.password || req.body.password.length < 6){
            return res.status(400).json({
                status: 'fail',
                data: "Password must be at least 6 characters long"
            });
        }
        if(!req.body.mobile){
            return res.status(400).json({
                status: 'fail',
                data: "Mobile Number is required"
            });
        }
        const existingUser = await UserModel.aggregate([
            {$match: {email: req.body.email}}
        ])

        if(existingUser.length > 0){
            return res.status(400).json({
                status: 'fail',
                data: "Email already registered"
            });
        }

        const reqBody = req.body;
        const password = bcrypt.hashSync(reqBody.password, 10);
        reqBody.password = password;
        const result = await UserModel.create(reqBody);

        if(result){
            result.password = undefined;
            res.status(200).json({
                status: 'success',
                data: result
            });
        }

    }catch (err){
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }

}
exports.login = async (req, res)=>{

    try{

        if(!req.body.email){
            return res.status(400).json({
                status: 'fail',
                data: "Email is required"
            });
        }
        if(!req.body.password || req.body.password.length < 6){
            return res.status(400).json({
                status: 'fail',
                data: "Password must be at least 6 characters long"
            });
        }

        const reqBody = req.body;

       const result = await UserModel.aggregate([
                {$match: {email: reqBody.email }},
                {$project: { email: 1, firstName: 1, lastName: 1, mobile: 1, photo: 1, role: 1, address: 1, password: 1}}
            ]);
        if(result.length === 0){
            return res.status(400).json({
                status: 'fail',
                data: "User not found"
            });
        }


        if(bcrypt.compareSync(reqBody.password, result[0].password )){
            result[0].password = undefined;

            const token = jwt.sign({
                _id: result[0]._id
            }, process.env.JWT_SECRET);
            res.status(200).json({
                status: "success",
                token: token,
                data: result
            })

        }else{
            return res.status(400).json({
                status: 'fail',
                data: "Email & Password doesn't match"
            });
        }

    }catch (err){
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
}
exports.profileUpdate = async (req, res)=>{
    try{

        const { firstName, lastName, password, address, mobile, photo } = req.body;
        const user = await UserModel.findById(req.user._id);


        let hashPassword = undefined;
        if(password !== "******" ){
            if(!password || password.length < 6){
                return res.status(400).json({
                    status: 'fail',
                    data: "Password must be at least 6 characters long"
                });
            }
            hashPassword = bcrypt.hashSync(password, 10)
        }





        const updated = await UserModel.findByIdAndUpdate(
            req.user._id,
            {
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
                password: hashPassword || user.password,
                address: address || user.address,
                mobile: mobile || user.mobile,
                photo: photo || user.photo
            },
            {
                new: true
            }
        );

        updated.password = undefined;

        if(updated){
            res.status(200).json({
                status: "success",
                data: updated
            })
        }

    }catch (err){
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
}

exports.profileDetails=(req,res)=>{
    const id =req.user._id;
    console.log(id)

    UserModel.findById(id, {_id:1,email:1,firstName:1,lastName:1,mobile:1,photo:1,password:1, address: 1})
        .then(data=>{
            return res.status(200).json({status:"success",data:data})
        })
        .catch(err=>{
            res.status(400).json({status:"fail",data:err})
        })
}



exports.secret = async (req, res) => {
    res.json({ currentUser: req.user });
};


exports.recoverVerifyEmail = async (req, res)=>{
    const email = req.params.email;
    try{
        const checkEmailExists = await UserModel.aggregate([
                { $match: {email: email} },
                { $count: 'total' }
            ]);

        if(checkEmailExists.length > 0){

            const generatedOtp = Math.floor(100000 + Math.random() * 900000);
            const insertOTP = await OTPModel.create({
                    email: email,
                    otp: generatedOtp
                });
            const sendEmail = await sendMailUtility(
                email,
                `Your PIN Code is= ${generatedOtp}`,
                "Task Manager PIN Verification"
            )

            res.status(200).json({
                status: 'success',
                data: sendEmail
            })
        }else {
            res.status(400).json({
                status: 'fail',
                data: "No User Found"
            })
        }
    }catch (err){
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
}
exports.recoverVerifyOTP = async (req, res)=>{
    const email = req.params.email;
    const OTP = req.params.otp;
    try{

        const checkOTP = await OTPModel.aggregate([
            {$match: {email: email,otp: OTP, status: 0}},
            {$count: 'total'}
        ]);
        if(checkOTP.length > 0){
            const updatedOTP = await OTPModel.updateOne(
                {
                    email: email,
                    otp: OTP,
                    status: 0
                    },
                { status: 1 }
            )
           return res.status(200).json({
                status: 'success',
                data: updatedOTP
            })
        }else {
            res.status(400).json({status: "fail", data: "Invalid OTP Code"})
        }

    }catch (err){
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
}
exports.recoverResetPass = async (req, res)=>{
    const email = req.body['email'];
    const OTP = req.body['otp'];
    const newPass = bcrypt.hashSync(req.body['password'], 10);
    try{

        const checkOTPUsed = await OTPModel.aggregate([
            {$match: {email: email,otp: OTP, status: 1}},
            {$count: 'total'}
        ]);

        if(checkOTPUsed.length > 0){
            const passUpdate = await UserModel.updateOne(
                { email: email},
                { password: newPass }
            )
            res.status(200).json({
                status: 'success',
                data: passUpdate
            })
        }else{
            res.status(400).json({status: "fail", data: "Invalid Request"})
        }

    }catch (err){
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
}