const express = require('express');
const dotenv = require('dotenv');
const follower = require("../model/followerModel.js");
const user = require("../model/userModel.js")
const chat=require("../model/chatModel")
const jwt = require('jsonwebtoken')
router = express.Router()
module.exports = router;
router.post("/profile/followers", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    const { userid, followers } = await follower.findOne({ user: user_ID });
    res.json({
        followers: followers
    });
})

router.post("/profile/following", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    const { userid, following } = await follower.findOne({ user: user_ID });
    res.json({
        following: following
    });
})

router.delete("/profile/followers", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    await follower.findOneAndUpdate({ user: user_ID }, { $pull: { followers: req.body.email } });
    Deleted_user = await user.findOne({ email: req.body.email })
    const user_main = await user.findOne({ _id: user_ID })
    await follower.findOneAndUpdate({ user: Deleted_user._id }, { $pull: { following: user_main.email } });
    res.json({
        message: "SUCCESSFULLY COMPLETED"
    });
})

router.delete("/profile/following", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    await follower.findOneAndUpdate({ user: user_ID }, { $pull: { following: req.body.email } });
    Deleted_user = await user.findOne({ email: req.body.email })
    const user_main = await user.findOne({ _id: user_ID })
    await follower.findOneAndUpdate({ user: Deleted_user._id }, { $pull: { followers: user_main.email } });
    res.json({
        message: "SUCCESSFULLY COMPLETED"
    });
})

router.post("/followUser", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    const user_find = await user.findOne({ _id: user_ID })
    const user_find2 = await user.findOne({ username: req.body.follow})
    
    if(await follower.findOne({ user: user_find2._id, followers: user_find.email }))
    {
        res.status(400).send("Already follow")
    }
    else if (user_ID===user_find2._id.toString()) {
        res.status(300).send("Already follow")
    }
    else {
        await follower.findOneAndUpdate({ user: user_find2._id}, { $push: { followers: user_find.email } })
        await follower.findOneAndUpdate({ user: user_ID }, { $push: { following: user_find2.email} })
        res.status(200).send("Success")
    }
})

router.post("/mutual", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    const follow_list=await follower.findOne({user:user_ID})
    let mutual=[]
    for(let i of follow_list.followers)
    {
        if(follow_list.following.includes(i))
        {
            mutual.push(i)
        }
    }
    res.status(200).json({
        mutual:mutual
    })
})

router.post("/getchats", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    const user_find1= await user.findOne({_id:user_ID})
    const user_find2=await user.findOne({email:req.body.email})
    let chats=await chat.find()
    chats=chats.filter(c=>{
        if((c.sender===user_find1.email||c.reciever===user_find1.email) && (c.sender===user_find2.email || c.reciever===user_find2.email))
        {
            return true;
        }
        else return false
    })
    res.status(200).json({
        chats:chats
    })
})
router.post("/sendchat", async (req, res) => {
    console.log("ABVVSVG")
    const decoded = jwt.verify(req.body.sender, "abc123")
    const user_ID = decoded.id;
    const user_find1= await user.findOne({_id:user_ID})
    const user_find2=await user.findOne({email:req.body.reciever})
    await chat.create({
        message:req.body.message,
        sender:user_find1.email,
        reciever:user_find2.email
    })
    let chats=await chat.find()
    chats=chats.filter(c=>{
        if((c.sender===user_find1.email||c.reciever===user_find1.email) && (c.sender===user_find2.email || c.reciever===user_find2.email))
        {
            return true;
        }
        else return false
    })
    res.status(200).json({
        chats:chats
    })
})