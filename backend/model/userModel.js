const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    fname:{
        type: String,
        required: [true]
    },
    lname:{
        type: String,
        required: [true]
    },
    age:{
        type: Number,
        required: [true]
    },
    Contact_num:{
        type: Number,
        required: [true]
    },
    username: {
        type: String,
        required: [true]
    },
    email: {
        type:String,
        required:[true]
    },
    password: {
        type:String,
        required:[true]
    }
})

module.exports=mongoose.model('users',userSchema);