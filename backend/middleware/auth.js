const jwt = require('jsonwebtoken');
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

//check if user is authenticated
exports.isAuthenticated = async (req,res,next, err) => {
    const {token} = req.cookies;
    let error = {...err}
    //make sure token exists
    if (!token) {
        console.log(error)
        return next (new ErrorResponse('You must log in to access this resource okay yeah', 401));
    }
    try {
       //verify token
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = await User.findById(decoded.id);
       next();
    } catch (error) {
        return next (new ErrorResponse('You must log in to access this resource okay dude', 401));
    }
}