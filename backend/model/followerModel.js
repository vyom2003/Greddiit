const mongoose = require("mongoose");
const followerSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true],
        ref: "users"
    },
    followers:[{
        type: String
    }],
    following:[{
        type: String
    }]
})

module.exports=mongoose.model('followers',followerSchema);