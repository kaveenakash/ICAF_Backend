const express = require("express");

const router = express.Router();
const messageController = require('../controllers/Message-Controller')





router.post('/message-save',messageController.SaveMessage)




module.exports = router;
