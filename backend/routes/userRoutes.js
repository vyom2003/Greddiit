const express = require('express');
const dotenv = require('dotenv');
const user = require("../model/userModel.js");
const follower = require("../model/followerModel.js");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
router = express.Router()
module.exports = router;
const { auth_check } = require("../middle/usermiddle")
router.get("/profile", auth_check, async (req, res) => {
    const { fname, lname, username, email, age, Contact_num } = await user.findById(req.user_find.id);
    const {followers,following}= await follower.findOne({user : req.user_find._id});
    res.json({
        fname: fname,
        lname: lname,
        username: username,
        email: email,
        age: age,
        Contact_num: Contact_num,
        followers:followers,
        following:following
    });
})
router.post("/", async (req, res) => {
    const { fname, lname, username, email, age, Contact_num, password } = req.body;
    if (!fname) {
        const user_login = await user.findOne({ email: email });
        if (!user_login) {
            res.status(400).send({
                message: "Wrong pass/email"
            });
        }
        else {
            let flag = await bcrypt.compare(password, user_login.password);
            if (flag) {
                res.status(200).send({
                    token: generateToken(user_login._id)
                })
            }
            else {
                res.status(400).send({
                    message: "Wrong pass/email"
                });
            }
        }
    }
    else {
        const userExists = await user.findOne({email: email });
        const userExists2=await user.findOne({username:username})
        if (userExists || userExists2||fname===""||lname===""||email===""||age===""||Contact_num===""||username===""||password===""||
        Number(age)<18||Contact_num.toString().length!=10||!email.includes('@')||!email.includes('.')) {
            res.status(400).send("User already exists");
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(password, salt);
            const New_user = await user.create({
                username: username,
                email: email,
                password: hashedPass,
                fname: fname,
                lname: lname,
                age: age,
                Contact_num: Contact_num
            })
            await follower.create({
                user:New_user._id,
                followers:[],
                following:[]
            })
            if (New_user) {
                res.json({
                    token: generateToken(New_user.id)
                })
            }
            else {
                res.status(400).send("User details are incorrect");
            }
        }
    }
})
router.put("/profile/edit",async (req, res) => {
    const { fname, lname, age, Contact_num } = req.body;
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    var query = {
        fname: fname,
        lname: lname,
        age: age,
        Contact_num: Contact_num
    }
    if(fname===""||lname===""||age===""||Contact_num===""||
    Number(age)<18||Contact_num.toString().length!=10)
    {
        res.status(400).send({message:"UNSUCCESSFUL"})
    }
    await user.findOneAndUpdate({_id:user_ID},query)
    res.status(200).send({
        message: "UPDATE SUCCESSFUL"
    })
})
const generateToken = (id) => {
    return jwt.sign({ id }, "abc123");
}