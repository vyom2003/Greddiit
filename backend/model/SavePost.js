const mongoose = require('mongoose')

const saveSchema = new mongoose.Schema({
    greddiit_name:{
        type:String
    },
    post_id:{
        type:mongoose.Schema.Types.ObjectId
    },
    user_id:[{
        type:mongoose.Schema.Types.ObjectId
    }]
}, {
    timestamps: [true]
})

module.exports = mongoose.model('saves', saveSchema)