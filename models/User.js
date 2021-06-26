const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fname:{type:String,required:true},
    lname:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlength:6},
    role:{type:String,required:true,trim:true},
    content:{type:String},
})
 
userSchema.plugin(uniqueValidator)

const User = mongoose.model('User',userSchema)

module.exports =  User