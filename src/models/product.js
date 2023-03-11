const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        maxLength: 160
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 2000
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
    quantity: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        type: String,
        required: true
    },
    shipping: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
})

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;