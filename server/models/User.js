const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 9,
  },
  loginAttempts:{
    type:Number,
    default:0,
  },
  lockoutUntil:{
    type: Date,
    default: null,
  },
  lastFailedAt:{
    type: Date,
    default: null,
  },
  plan:{
    type:String,
    enum:["free","pro"],
    default:"free",
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;