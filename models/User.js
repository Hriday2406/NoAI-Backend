const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  otp: {
    type: String,
    select: false
  },
  otpExpires: {
    type: Date,
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash OTP before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('otp') || !this.otp) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.otp = await bcrypt.hash(this.otp, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare OTP method
userSchema.methods.compareOTP = async function(enteredOTP) {
  if (!this.otp) return false;
  return await bcrypt.compare(enteredOTP, this.otp);
};

// Check if OTP is expired
userSchema.methods.isOTPExpired = function() {
  if (!this.otpExpires) return true;
  return Date.now() > this.otpExpires;
};

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.otp;
  delete user.otpExpires;
  return user;
};

module.exports = mongoose.model('User', userSchema);