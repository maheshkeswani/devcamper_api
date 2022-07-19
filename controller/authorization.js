const asyncHandler = require('../middleware/async')
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');



exports.register = asyncHandler(async (req,res,next) => {
const {name,email,password,role} = req.body;
const user  = await User.create({name,email,password,role});
sendTokenResponse(user,200,res);

})

exports.logIn = asyncHandler(async (req,res,next) => {
    const {email,password}  = req.body;
    const user = await User.findOne({email}).select('+password');
    if(!user)
    {
        return next(new ErrorResponse(`Invalid credential`,404))
    }
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
                return next(new ErrorResponse(`Invalid credential`,404))

    }
    // Create Token
sendTokenResponse(user,200,res);
})

sendTokenResponse = async (user,statusCode,res) => {
    const token  = await user.getSignjwToken();

    const options  = {
    expires : new Date( Date.now() + 30*24*60*60*1000),
    httpOnly: true,
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res.status(statusCode).cookie('token',token,options).json({success : true , token : token})
}

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });


  res.status(200).json({
    success: true,
    data: user
  });
});
// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
// exports.resetPassword = asyncHandler(async (req, res, next) => {
//   // Get hashed token
//   const resetPasswordToken = crypto
//     .createHash('sha256')
//     .update(req.params.resettoken)
//     .digest('hex');

//   const user = await User.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() }
//   });

//   if (!user) {
//     return next(new ErrorResponse('Invalid token', 400));
//   }

//   // Set new password
//   user.password = req.body.password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;
//   await user.save();

//   sendTokenResponse(user, 200, res);
// });
