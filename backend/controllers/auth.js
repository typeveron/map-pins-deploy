const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.signup = async (req, res, next)=> {
        
    const {email} = req.body;
    const userExist = await User.findOne({email});

    if (userExist) {
        return next(new ErrorResponse(`Email already exists`, 404))
    }

    
    try {
        const user = await User.create(req.body);
        generateToken(user, 201, res);


    } catch (error) {
       console.log(error);
       next(error);
    }
}

exports.signin = async (req, res, next)=> {
    try {
        const {username, password} = req.body;
        //if no username and password
        if (!username || !password) {
            return next(new ErrorResponse(`Username and password are required`, 404))
        }
        //check username
        const user = await User.findOne({username});
        if (!user) {
            return next(new ErrorResponse(`Invalid credentials`, 404))
        }

        //verify user password
        const isMatched = await user.comparePassword(password);
        if (!isMatched) {
            return next(new ErrorResponse(`Cannot log in, check your credentials`, 404))
        }

        generateToken(user, 200, res);
        
    } catch (error) {
        console.log(error);
        return next(new ErrorResponse(`Cannot log in, check your credentials`, 404))
    }

}


const generateToken = async (user, statusCode, res) => {
    const token = await user.jwtGenerateToken();
    const time = 7200000;
    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + time),
        secure: true,
        sameSite: 'none'
    };
    res.status(statusCode)
        .cookie('token', token, options)
        .json({success: true, token: token, user: user})
}

//Log Out User
exports.logout = (req,res,next) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Logged out"
    })
}

exports.singleUser = async (req, res, next)=> {
    
    
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        next(error);
    }
}

//User Profile
exports.userProfile = async (req,res,next) => {
        const user = await User.findById(req.params.id);
        res.status(200).json({
        success: true,
        user
    })
}