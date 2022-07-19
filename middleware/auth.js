const jwt  = require('jsonwebtoken')
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

exports.protect = asyncHandler(async (req,res,next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    {
                    console.log("req header  Ran".inverse.green)

        token = req.headers.authorization.split(' ')[1];
        console.log(token)
    }

    if(!token)
    {
                    console.log("no token Ran".inverse.green)

        return next(new ErrorResponse('Not Authorized',401))
    }
        try{
        const decoded  = await jwt.verify(token,process.env.JWT_SECRET);
        req.user  = await User.findById(decoded.id)
        console.log(decoded)
        next() }
        catch (err)
        {
            console.log("catch Ran".inverse.green)
             return next(new ErrorResponse('Not Authorized',401))
        }

} )

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};