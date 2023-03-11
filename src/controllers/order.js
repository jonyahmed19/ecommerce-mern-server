const OrderModel = require('../models/order')


exports.getOrders = async (req, res)=>{
    try {
    const orders = await OrderModel.find({ buyer: req.user._id })
        .populate("products")
        .populate("buyer" );

        return res.status(200).json({
            status: 'success',
            data: orders
        })
    } catch (err) {
            res.status(500).json({
                status: 'fail',
                data: err
            })
    }
};

exports.allOrders = async (req, res)=>{
    try {
    const orders = await OrderModel.find({  })
        .populate("products")
        .populate("buyer" );

        return res.status(200).json({
            status: 'success',
            data: orders
        })
    } catch (err) {
            res.status(500).json({
                status: 'fail',
                data: err
            })
    }
};