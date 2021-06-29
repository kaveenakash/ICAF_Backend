const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


//SignUp function
const WorkShopSignUp = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError("Invalid inputs passed, please check your data.", 422)
      );
    }
    const { name,title, email, password,content } = req.body;
    const role = "workshop-conductor"
    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
    } catch (err) {
      const error = new HttpError(
        "Signing up failed, please try again later.",
        500
      );
      return next(error);
    }
    if (existingUser) {
      const error = new HttpError(
        "User exists already, please login instead.",
        422
      );
      return next(error);
    }
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new HttpError("could not create user, Please try again", 500);
      return next(error);
    }
    console.log(req.file.path)
    const createdUser = new User({
      name:name,
      title:title,
      email:email,
      content:content,
      role:role,
      document:req.file.path,
      password: hashedPassword,
    });
  
    try {
      await createdUser.save();
    } catch (err) {
      const error = new HttpError("Signing Up failed,Please try again", 500);
      return next(error);
    }
    
    let token;
    try {
      token = await jwt.sign(
        { userId: createdUser.id, email: createdUser.email },
        "supersecret_dont_share",
        { expiresIn: "1h" }
        );
      } catch (err) {
        const error = new HttpError("Signing Up failed,Please try again", 500);
        return next(error);
      }
     
  
    res
      .status(201)
      .json({ userId: createdUser.id, email: createdUser.email, token: token,role:role });
  };
  

  module.exports = {
    WorkShopSignUp
  }