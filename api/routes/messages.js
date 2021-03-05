const express = require("express");
const router = express.Router();
const Message = require('../models/Message');
// const checkAuth = require('../middleware/check-auth');

router.get('/all', async(req, res) => {
    try{
        const messages = await Message.find();
        res.json({messages: messages});
        console.log(req.userData);
    }catch(err){
        res.json({error: err});
    }
})

router.post('/send/:username', async(req, res) => {
    try{
        const message = new Message({
            username: req.params.username,
            message: req.body.message
        })
        const postedMessage = await message.save();
        res.json(postedMessage);
    }catch(err){
        res.json({error: err});
    }
})

module.exports = router;