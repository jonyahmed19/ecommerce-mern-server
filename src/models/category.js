const mongoose = require('mongoose');
const {model} = require("mongoose");

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxLength: 32
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;