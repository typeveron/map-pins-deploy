const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: [3, "Username must have at least 3 characters"],
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 40,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid E-mail'
        ]
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must have at least 6 characters"],
        match: [ /((?=.*[A-Z]))/, "Password must have at least 1 uppercase letter"],
    },
  },
{ timestamps: true }
);

//Schema validation 
UserSchema.post('save', function(error, doc, next) {
    if (error.name == "ValidationError") {
        next(new ErrorResponse(error.message, 400));
    } else if(error.name == "MongoServerError"){
        next(new ErrorResponse(error.message, 400));
    } else if(!error){
        next();
    }
});

//encrypting password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//verify password
UserSchema.methods.comparePassword = async function(yourPassword) {
    return await bcrypt.compare(yourPassword, this.password);
}

//get token
UserSchema.methods.jwtGenerateToken = function(){
    return jwt.sign({id: this.id}, process.env.JWT_SECRET, {
        expiresIn: 7200
    });
};

module.exports = mongoose.model("User", UserSchema);
