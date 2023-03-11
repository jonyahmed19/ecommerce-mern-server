const mongoose = require('mongoose');
const {model} = require("mongoose");
const {ObjectId} = mongoose.Schema;

const orderSchema = mongoose.Schema(
    {
        products: [{type: ObjectId, ref: "Product"}],
        payment: {},
        buyer: {
            type: ObjectId,
            ref: "User"
        },
        status: {
            type: String,
            default: "Not Processed",
            enum: [
                "Not Processed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled"
            ]
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;