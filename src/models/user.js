const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        mobile: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        photo: {
          type: String
        },
        address: {
            type: String
        },
        role: {
            type: Number,
            default: 0
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
    );

const User = mongoose.model("User", userSchema);

module.exports = User;
