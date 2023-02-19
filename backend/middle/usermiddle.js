const jwt = require('jsonwebtoken')
const user= require("../model/userModel.js");
const auth_check=async (req,res,next)=>{
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    {
        try{
            token = req.headers.authorization.split(" ")[1];
            const decoded= jwt.verify(token,"abc123")
            const user_ID = decoded.id;
            req.user_find = await user.findOne({_id: user_ID}).select("-password");   
            next();         
        }catch(error)
        {
            res.status(400).send("Authorization failed")
            return 0;
        }
    }
    if(!token)
    {
        res.status(400).send("Authorization failed")
        return 0;
    }
}
module.exports= {auth_check}