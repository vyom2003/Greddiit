const MongoClient = require('mongoose');

const connectDB=async()=>{
    try{
        const conn= await MongoClient.connect("mongodb+srv://vyom:vyom2003@dass-1.uq862gi.mongodb.net/Greddiit?retryWrites=true&w=majority")
        console.log(`MongoDB connected: ${conn.connection.host}`)
    }catch(error)
    {
        console.log(error);
    }
}

module.exports= connectDB;