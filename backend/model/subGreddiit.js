const mongoose = require('mongoose')

const subgreddiitSchema = new mongoose.Schema({
    moderator: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true],
    },
    name: {
        type: String,
        required: [true],
        unique: [true]
    },
    description: {
        type: String,
        required: [true]
    },
    tags: [{
        type: String,
    }],
    bannedWords: [{
        type: String
    }],
    followers: [{
        type:String
    }],
    left: [{
        type: String
    }],
    requests: [{
        type: String
    }],
    posts:[{
        type:mongoose.Schema.Types.ObjectId
    }],
    blocked:[{
        type:String
    }],
    reports:[{
        post_id:{
            type:mongoose.Schema.Types.ObjectId
        },
        reason:{
            type:String
        },
        by:{
            type:String
        },
        action:{
            type:Number
        },
        time:{
            type:Number
        }
    }],
    stats:[{
        date:{
            type:String
        },
        num_users:{
            type:Number
        },
        num_posts:{
            type:Number
        },
        num_visits:{
            type:Number
        },
        num_reports:{
            type:Number
        },
        num_delete:{
            type:Number
        }
    }]
},{
    timestamps: [true]
})

module.exports = mongoose.model('subgreddiit', subgreddiitSchema)