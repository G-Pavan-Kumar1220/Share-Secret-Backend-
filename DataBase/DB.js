const mongoose = require('mongoose')

const connectDB = async()=>{
    const connection = await mongoose.connect(process.env.MONGO_URI)
    if(!connection){
        return res.json({message:"Database is not Connected"})
    }
    console.log("DataBase is Connected")
}

module.exports = connectDB