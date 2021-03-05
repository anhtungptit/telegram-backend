const express = require('express');
const router = express.Router();
const User = require('../models/User');
const brcypt = require('bcrypt');
const jwt = require("jsonwebtoken");

router.post('/login', async(req, res) => {
    try{
        const users = await User.find({username: req.body.username});
        if(users.length < 1){
            res.json({message: "Auth failed...."});
        }else {
            brcypt.compare(req.body.password, users[0].password, (err, result) => {
                if(err){
                    res.json({error: err});
                }else{
                    if(result){
                        const token = jwt.sign({
                            username: users[0].username,
                            userId: users[0]._id
                        }, "secret", {
                            expiresIn: "1h"
                        })
                        res.json({message: "Auth successful", username: users[0].username, token: token});
                    }else {
                        res.json({message: "Auth failed...."});
                    }
                }
            })
        }
    }catch(err){
        res.json({error: err});
    }
})

router.get('/', async(req, res) => {
    const user = await User.find();
    console.log(user);
    res.json(user);
})

router.post('/signup', async(req, res) => { 
    try{
        const users = await User.find({username: req.body.username});
        if(users.length >= 1){
            res.json({message: "Username already exists"})
        }else{
            brcypt.hash(req.body.password, 10, async(err, hash) => {
                if(err){
                    res.json({error: err})
                }else {
                    const user = new User({
                        username: req.body.username,
                        password: hash
                    })
                    const savedUser = await user.save()
                    res.json({message: "user created " , user: savedUser});
                }
            })
        }
    }catch(err){
        res.json({error: err});
    }
})


module.exports = router;