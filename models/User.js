const mongoose = require('mongoose')
const Joi = require('joi');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('The email is invalid')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
     }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, {
    timestamps: true
})

//Hashing the plane password
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

// Generate token
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

// checking if user exists

userSchema.statics.findByCredentials = async (email, password) =>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}



const User = mongoose.model('User',userSchema)
module.exports = User