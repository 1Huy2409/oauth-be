import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullname: {
        type: String, 
        require: true
    },
    age: {
        type: Number, 
        require: false,
    },
    email: {
        type: String, 
        require: true,
        unique: true
    },
    username: {
        type: String, 
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    providers: {
        google: {
            id: String, 
            email: String
        },
        facebook: {
            id: String,
            email: String
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    loginMethod: {
        type: String,
        enum: ['local','google','facebook'],
        default: 'local'
    },
    role: {
        type: String, 
        default: "user",
        require: true
    }
},
{
    timestamps: true
})

const User = mongoose.model("users", userSchema)
export default User