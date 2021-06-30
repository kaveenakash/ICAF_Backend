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
  const { name, title, email, password, content } = req.body;
  const role = "workshop-conductor";
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
  console.log(req.file.path);
  const createdUser = new User({
    name: name,
    title: title,
    email: email,
    content: content,
    status: "pending",
    role: role,
    document: req.file.path,
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
    .json({
      userId: createdUser.id,
      email: createdUser.email,
      token: token,
      role: role,
    });
};

const GetAllWorkshopData = async (req, res, next) => {
  try {
    const response = await User.find({ role: "workshop-conductor"  });
    return res.status(200).send(response);
  } catch (err) {
    const error = new HttpError("Unexpected Error Occured", 500);
    return next(error);
  }
};

const ApproveWorkshop = async (req, res, next) => {
  const  {id}  = req.body
  console.log(id)

  const filter = { _id: id };
  const update = { status: "approved" };

  try {
    let response = await User.findOneAndUpdate(filter, update, {
      new: true,
    });
    return res.status(200).json({message:"successful"})
  } catch (err) {
    
    const error = new HttpError("Unexpected Error Occured", 503);
    return next(error);
  }

  
};


const DeleteWorkshop = async(req,res,next) =>{
  const {id} = req.body
  console.log(id)
  try {
    const response = await User.findOneAndRemove({_id:id})
  } catch (err) {
    const error = new HttpError("Unexpected Error Occured", 503);
    return next(error);
  }
  return res.status(200).json({"message":"deleted workshop"})
}

module.exports = {
  WorkShopSignUp,
  GetAllWorkshopData,
  ApproveWorkshop,
  DeleteWorkshop
};
