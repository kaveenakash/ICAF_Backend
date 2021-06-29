const Message = require('../models/Message')

const HttpError = require("../models/http-error");



const SaveMessage = async (req,res,next) =>{

    if(!req.body){
        return next(
            new HttpError("Invalid Message", 422)
          );
    }
    console.log(req.body)
    const {name,email,subject,message} = req.body

    const newMessage = new Message({
        name,
        email,
        subject,
        message
    })

    try {
      const createdNessage = await newMessage.save()
        
    } catch (err) {
        const error = new HttpError("Message Save failed", 500);
        return next(error);
    }
    return res.status(200).json({message:"message Saved Successfully"})

}


module.exports = {
    SaveMessage
}