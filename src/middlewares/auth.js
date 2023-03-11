const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const requireSignin = (req, res, next) =>{
    try{

        const decoded = jwt.verify(
            req.headers.token,
            process.env.JWT_SECRET
        );
        req.user = decoded;
        next()
    }catch (err){
      return res.status(401).json({
            status: 'fail',
            data: "Unauthorized Request"
        })
    }
}
const isAdmin = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user._id);
        if (user.role !== 1) {
            return res.status(401).json({
                status: 'fail',
                data: "Unauthorized Request"
            })
        } else {
            next();
        }
    } catch (err) {
        return res.status(401).json({
            status: 'fail',
            data: err
        })
    }
};

module.exports = {
    requireSignin,
    isAdmin
}