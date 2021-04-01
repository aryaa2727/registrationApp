
const dotenv = require("dotenv")
dotenv.config()

const mongoDB = require("mongodb")

mongoDB.connect(process.env.CONNECTIONSTRING,{useNewUrlParser: true, useUnifiedTopology: true},(err,client)=>{
    module.exports = client
    
    const server=require("./app")
    server.listen(process.env.PORT)

    
})