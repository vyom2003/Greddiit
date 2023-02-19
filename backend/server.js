const express=require("express");
const dotenv= require("dotenv");
var cors = require('cors')
const port =3001;
const app = express();
app.use(cors())
const connectDB=require("./config/db.js")
connectDB();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use("/",require("./routes/userRoutes.js"));
app.use("/",require("./routes/followerRoutes.js"))
app.use("/",require("./routes/MySubRoutes.js"))
app.listen(port,()=>{console.log(`Server started on ${port}`)});