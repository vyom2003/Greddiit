const express = require('express');
const dotenv = require('dotenv');
const follower = require("../model/followerModel.js");
const user = require("../model/userModel.js")
const post = require("../model/PostModel")
const subgreddiit = require("../model/subGreddiit.js");
const jwt = require('jsonwebtoken')
const saved = require("../model/SavePost")
router = express.Router()

// Time to KEEP Report
const TIME_REPORT = 60*24*10*60 * 1000
module.exports = router;
router.post("/mysub", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    const subExists = await subgreddiit.findOne({ name: req.body.name });
    if (subExists) {
        res.status(400).json({ message: "SubGreddiit already exists" });
    }
    else {
        const tags = req.body.tags.split(",")
        const banned = req.body.ban.split(",")
        const New_greddiit = await subgreddiit.create({
            moderator: user_ID,
            name: req.body.name,
            description: req.body.desc,
            tags: tags,
            bannedWords: banned,
            followers: [user_ID],
            left: [],
            requests: [],
            posts: [],
            blocked: [],
            reports: [],
            stats: []
        })
        if (New_greddiit) {
            const d = new Date()
            let str = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
            await subgreddiit.findOneAndUpdate({ name: New_greddiit.name }, { $push: { stats: { date: str, num_users: 1, num_posts: 0, num_visits: 0, num_reports: 0, num_delete: 0 } } })
            res.status(200).json({
                message: "success"
            });
        }
        else {
            res.status(400).json({
                message: "Failed to create"
            });
        }
    }
})
router.delete("/mysub", async (req, res) => {
    const gred = await subgreddiit.findOne({ name: req.body.name })
    for (let i of gred.posts) {
        await post.findOneAndDelete({ _id: i })
        await saved.findOneAndDelete({ post_id: i })
    }
    await subgreddiit.findOneAndDelete({ name: req.body.name })
    res.status(200).send("Successful");
})
router.put("/mysub", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    const obj = await subgreddiit.find({ moderator: user_ID });
    res.status(200).json(obj);
})
router.post("/sub", async (req, res) => {
    const subs = await subgreddiit.find()
    const decoded = jwt.verify(req.body.id, "abc123")
    res.status(200).json({
        subs: subs,
        id: decoded
    })
})
router.post("/sub/join", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    const user_find = await user.findOne({ _id: user_ID })
    const subs = await subgreddiit.findOne({ name: req.body.sub_name, left: user_ID })
    if (subs) {
        res.status(400).json({
            message: "Left Greddiit"
        })
    }
    else {
        const subs_req = await subgreddiit.findOne({ name: req.body.sub_name, requests: user_find.username })
        if (subs_req) {
            res.status(300).json({
                message: "Already sent request"
            })
        }
        else {
            await subgreddiit.findOneAndUpdate({ name: req.body.sub_name }, { $push: { requests: user_find.username } })
            res.status(200).json({
                message: "Request sent Successfully"
            })
        }
    }
})
router.post("/sub/leave", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    const subs = await subgreddiit.findOne({ name: req.body.sub_name, moderator: user_ID })
    if (subs) {
        res.status(400).json({
            message: "You are Moderator"
        })
    }
    else {
        await subgreddiit.findOneAndUpdate({ name: req.body.sub_name }, { $pull: { followers: user_ID }, $push: { left: user_ID } })
        res.status(200).json({
            message: "Left Successfully"
        })
    }
})

router.post("/findlike", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    const post_find = await post.findOne({
        _id: req.body.postid,
        likes: user_ID
    })
    const post2 = await post.findOne({
        _id: req.body.postid,
        dislikes: user_ID
    })
    if (post_find) {
        res.json({
            liked: 1,
            disliked: 0
        })
    }
    else if (post2) {
        res.status(200).json({
            liked: 0,
            disliked: 1
        })
    }
    else (res.json({
        liked: 0, disliked: 0
    }))
})

router.post("/addlike", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    await post.findOneAndUpdate({
        _id: req.body.postid
    }, { $push: { likes: user_ID }, $pull: { dislikes: user_ID } })

    res.status(200).json({
        message: "Success"
    })
})
router.post("/removelike", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    await post.findOneAndUpdate({
        _id: req.body.postid
    }, { $pull: { likes: user_ID } })

    res.status(200).json({
        message: "Success"
    })
})
router.post("/adddislike", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    await post.findOneAndUpdate({
        _id: req.body.postid
    }, { $push: { dislikes: user_ID }, $pull: { likes: user_ID } })

    res.status(200).json({
        message: "Success"
    })
})
router.post("/removedislike", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    await post.findOneAndUpdate({
        _id: req.body.postid
    }, { $pull: { dislikes: user_ID } })

    res.status(200).json({
        message: "Success"
    })
})

router.post("/addcomment", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    const user_find = await user.findOne({ _id: user_ID })
    await post.findOneAndUpdate({
        _id: req.body.postid
    }, { $push: { comments: { user: user_find.username, content: req.body.comment_content } } })

    res.status(200).json({
        message: "Success"
    })
})

router.put("/sub/:id", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    const sub = await subgreddiit.findOne({ name: req.body.name, followers: user_ID })
    const user_find = await user.findOne({ _id: user_ID })
    if(req.body.postContent=="")
    {
        res.status(400).send("Post empty")
    }
    if (!sub) {
        res.status(400).send("Authorisation denied")
    }
    else {
        const new_post = await post.create({
            greddiit_name: req.body.name,
            user: user_find.username,
            content: req.body.postContent,
            likes: [],
            dislikes: [],
            comments: []
        })
        await saved.create({
            greddiit_name: req.body.name,
            post_id: new_post._id,
            user_id: []
        })
        await subgreddiit.findOneAndUpdate({ name: req.body.name }, { $push: { posts: new_post._id } })
        const d = new Date()
        let str = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
        if (await subgreddiit.findOne({ name: req.body.name, "stats.date": str })) {
            await subgreddiit.findOneAndUpdate({ name: req.body.name }, { $inc: { "stats.$[ele].num_posts": 1 } }, { arrayFilters: [{ "ele.date": str }] })
        }
        else {
            await subgreddiit.findOneAndUpdate({ name: req.body.name }, { $push: { stats: { date: str, num_users: 0, num_posts: 1, num_visits: 0, num_reports: 0, num_delete: 0 } } })
        }
        res.status(200).send("Success")
    }
})
router.post("/sub/:id", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    const sub = await subgreddiit.findOne({ name: req.body.name, followers: user_ID })
    const posts = await post.find({ greddiit_name: req.body.name })
    if (sub === null) {
        res.status(400).send("Authorisation denied")
    }
    else {
        let follow = []
        let join = []
        let reports = []
        const d1 = new Date()
        let time = d1.getTime()
        for (let i of sub.followers) {
            const user_find = await user.findOne({ _id: i })
            follow.push(user_find.username)
        }
        for (let i of sub.requests) {
            const user_find = await user.findOne({ username: i })
            join.push(user_find)
        }
        for (let i of sub.reports) {
            if (time - i.time < TIME_REPORT) {
                reports.push(i)
            }
            else {
                await subgreddiit.findOneAndUpdate({ _id: sub._id }, { $pull: { reports: { _id: i._id } } })
            }
        }
        sub.reports = reports
        if (sub.moderator.toString() !== user_ID) {
            for (let i = 0; i < posts.length; i++) {
                if (await subgreddiit.findOne({ name: req.body.name, blocked: posts[i].user })) {
                    posts[i].user = "Banned User"
                }
            }
        }
        res.status(200).json({
            sub: sub,
            posts: posts,
            users: follow,
            join: join
        })
    }
})

router.post("/savepost", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    const post = await saved.findOne({ post_id: req.body.postid, user_id: user_ID })
    if (post) {
        res.status(400).send("Already present")
    }
    else {
        await saved.findOneAndUpdate({ post_id: req.body.postid }, { $push: { user_id: user_ID } })
        res.status(200).send("Done")
    }
})

router.post("/unsavepost", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    await saved.findOneAndUpdate({ post_id: req.body.postid }, { $pull: { user_id: user_ID } })
    res.status(200).send("Done")
})

router.post("/findsaved", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    const post = await saved.find({ user_id: user_ID })
    res.status(200).json({
        posts: post
    })
})
router.post("/getpost", async (req, res) => {
    const post_find = await post.findOne({ _id: req.body.postid })
    res.status(200).json({
        posts: post_find
    })
})

router.post("/adduser", async (req, res) => {
    await subgreddiit.findOneAndUpdate({ _id: req.body.greddiit }, { $pull: { requests: req.body.user.username } })
    const user_find = await user.findOne({ username: req.body.user.username })
    await subgreddiit.findByIdAndUpdate({ _id: req.body.greddiit }, { $push: { followers: user_find._id }, $pull: { blocked: user_find.username } })
    const d = new Date()
    let str = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
    if (await subgreddiit.findOne({ _id: req.body.greddiit, "stats.date": str })) {
        await subgreddiit.findOneAndUpdate({ _id: req.body.greddiit }, { $inc: { "stats.$[ele].num_users": 1 } }, { arrayFilters: [{ "ele.date": str }] })
    }
    else {
        await subgreddiit.findOneAndUpdate({ _id: req.body.greddiit }, { $push: { stats: { date: str, num_users: 1, num_posts: 0, num_visits: 0, num_reports: 0, num_delete: 0 } } })
    }
    res.status(200).send("success")
})

router.post("/rejectuser", async (req, res) => {
    await subgreddiit.findOneAndUpdate({ _id: req.body.greddiit }, { $pull: { requests: req.body.user } })
    res.status(200).send("success")
})

router.post("/reportpost", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    const user_find = await user.findOne({ _id: user_ID })
    const d1 = new Date()
    await subgreddiit.findOneAndUpdate({ name: req.body.greddiit }, {
        $push: {
            reports: {
                post_id: req.body.post_id,
                reason: req.body.reason,
                by: user_find.username,
                action: 0,
                time: d1.getTime()
            }
        }
    })
    const d = new Date()
    let str = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
    if (await subgreddiit.findOne({ name: req.body.greddiit, "stats.date": str })) {
        await subgreddiit.findOneAndUpdate({ name: req.body.greddiit }, { $inc: { "stats.$[ele].num_reports": 1 } }, { arrayFilters: [{ "ele.date": str }] })
    }
    else {
        await subgreddiit.findOneAndUpdate({ name: req.body.greddiit }, { $push: { stats: { date: str, num_users: 0, num_posts: 0, num_visits: 0, num_reports: 1, num_delete: 0 } } })
    }
    res.status(200).send("success")
})

router.post("/ignorereport", async (req, res) => {
    const sub = await subgreddiit.findOneAndUpdate({ "reports._id": req.body.report }, { $set: { "reports.$[ele].action": 1 } }, { arrayFilters: [{ "ele._id": req.body.report }] })
    res.status(200).send("success")
})

router.post("/deletereport", async (req, res) => {

    await post.findOneAndDelete({ _id: req.body.report.post_id })
    await saved.findOneAndDelete({ post_id: req.body.report.post_id })
    const d = new Date()
    let str = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
    if (await subgreddiit.findOne({ "reports._id": req.body.report.report_id, "stats.date": str })) {
        await subgreddiit.findOneAndUpdate({ "reports._id": req.body.report.report_id }, { $inc: { "stats.$[ele].num_delete": 1 } }, { arrayFilters: [{ "ele.date": str }] })
    }
    else {
        await subgreddiit.findOneAndUpdate({ "reports._id": req.body.report.report_id }, { $push: { stats: { date: str, num_users: 0, num_posts: 0, num_visits: 0, num_reports: 0, num_delete: 1 } } })
    }
    await subgreddiit.findOneAndUpdate({ "reports._id": req.body.report.report_id }, { $pull: { posts: req.body.report.post_id } })
    await subgreddiit.findOneAndUpdate({ "reports._id": req.body.report.report_id }, { $pull: { reports: { _id: req.body.report.report_id } } })
    res.status(200).send("success")
})

router.post("/blockreport", async (req, res) => {
    const user_find = await user.findOne({ username: req.body.report.user })
    await subgreddiit.findOneAndUpdate({ "reports._id": req.body.report.report_id }, { $pull: { reports: { _id: req.body.report.report_id }, followers: user_find._id }, $push: { blocked: user_find.username } })
    res.status(200).send("success")
})

router.post("/visit", async (req, res) => {
    const d = new Date()
    let str = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
    if (await subgreddiit.findOne({ name: req.body.name, "stats.date": str })) {
        await subgreddiit.findOneAndUpdate({ name: req.body.name }, { $inc: { "stats.$[ele].num_visits": 1 } }, { arrayFilters: [{ "ele.date": str }] })
    }
    else {
        await subgreddiit.findOneAndUpdate({ name: req.body.name }, { $push: { stats: { date: str, num_users: 0, num_posts: 0, num_visits: 1, num_reports: 0, num_delete: 0 } } })
    }
    res.sendStatus(200)
})

router.post("/addnest", async (req, res) => {
    const decoded = jwt.verify(req.body.id, "abc123")
    const user_ID = decoded.id;
    const user_find = await user.findOne({ _id: user_ID })
    if (req.body.comment_content !== null) {
        await post.findOneAndUpdate({
            _id: req.body.postid
        }, { $push: { comments: { user: user_find.username, content: req.body.comment_content, parent: req.body.parent } } })
    }
    const post_find = await post.findOne({
        _id: req.body.postid
    })
    let children = []
    for (let i of post_find.comments) {
        if (i.parent !== null && i.parent.toString() === req.body.parent.toString()) {
            children.push(i)
        }
    }
    res.status(200).json({
        children: children
    })
})

router.post("/getnum", async (req, res) => {
    const post_find = await post.findOne({"comments._id":req.body.id})
    let num=0
    for(let i of post_find.comments)
    {
        if(i.parent!==null&&i.parent.toString()===req.body.id)
        {
            num++
        }
    }
    
    res.status(200).json({
        num:num
    })
})