const { default: mongoose } = require("mongoose")
const crypto = require('crypto');
const bcrypt  = require('bcryptjs')
const jwt  = require('jsonwebtoken');
const { nextTick } = require("process");
const UserSchema = mongoose.Schema({
    name :{
        type : String,
        required : [true,'Please Add A Name']
    },
    email:{
        type : String,
        required : [true,'Please Add Email'],
        match : [
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email',
        ],
        unique : true
    },
    password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
    },
    role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }

})

UserSchema.pre('save',async function (req,res,next){
  if(!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt);
})
UserSchema.methods.getSignjwToken = async function (){
return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE})
}
UserSchema.methods.matchPassword = async function(enteredPass){
  return bcrypt.compare(enteredPass,this.password)
}
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
module.exports  = mongoose.model('User',UserSchema)