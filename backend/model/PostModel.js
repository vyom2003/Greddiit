const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    greddiit_name:{
        type:String
    },
    user: {
        type: String
    },
    content: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    comments: [{
        parent:{
            type:mongoose.Schema.Types.ObjectId,
            default:null
        },
        user:{
            type:String
        },
        content:{
            type:String
        }
    }]
}, {
    timestamps: [true]
})

module.exports = mongoose.model('posts', postSchema)