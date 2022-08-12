const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add a username"],
        minlength: [3, 'username must have at least three(3) characters'],
        max: 20,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        max: 40,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: [3, 'password must have at least three(3) characters'],
    },
  },
{ timestamps: true }
);

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