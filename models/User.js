const bcrypt = require("bcryptjs")
const userCollectionDB = require("../db").db().collection("users")
const validator = require("validator")

let User = function(data){
    this.data1 = data
    this.errors = []

}

User.prototype.cleanUp=function(){
    if(typeof(this.data1.username) != "string" ){this.data1.username = ""}
    if(typeof(this.data1.email) != "string" ){this.data1.email = ""}
    if(typeof(this.data1.password) != "string" ){this.data1.password = ""}


    this.data1 = {
        username :this.data1.username.trim().toLowerCase(),
        email : this.data1.email.trim().toLowerCase(),
        password :this.data1.password.trim()
    }

    
}
User.prototype.validate=function(){
    if(this.data1.username == ""){
        this.errors.push("You have must provide a sername")
    }
    if(this.data1.username != "" && !validator.isAlphanumeric(this.data1.username)){
        this.errors.push("You have must provide a valid username,usernam can only contain letter and numbers")
    }
    if(! validator.isEmail(this.data1.email)){
        this.errors.push("You have must provide a valid email")
    }
    if(this.data1.password == ""){
        this.errors.push("You have must provide a password")
    } 
   
    if(this.data1.username.length > 0 && this.data1.username.length < 3){this.errors.push("username must be atleast 3 character")}
    if(this.data1.username.length > 30){this.errors.push("username can not exceed 30 characters") }

   
    if(this.data1.password.length > 0 && this.data1.password.length < 12){this.errors.push("password must be atleast 12 character")}
    if(this.data1.password.length > 50){ this.errors.push("password can exceed 50 characters")}
   
   
    if(this.data1.username.length  > 2 && this.data1.username.length < 31 && validator.isAlphanumeric(this.data1.username)){
        let userIsExist = userCollectionDB.findOne({username : this.data1.username})
        if(userIsExist){
            this.errors.push("Already exists username")
        }
    }

    
}


User.prototype.register = function (){
    
    this.validate()
    
    if(!this.errors.length){

        let salt= bcrypt.genSaltSync(10)
      
        this.data1.password = bcrypt.hashSync(this.data1.password,salt)
        
       
        userCollectionDB.insertOne(this.data1)
        
    }
    
}

User.prototype.login=function(){
    return new Promise((resolve, reject)=>{
        this.cleanUp()
    userCollectionDB.findOne({username : this.data1.username}).then((attemptedUser)=>{
        if(attemptedUser && bcrypt.compareSync(this.data1.password,attemptedUser.password)){
            resolve("congrats") 
         }
 
         else{
              reject("Invalid username And password")
         }
    }).catch(()=>{
        reject("Please again later / database error")
    })
    })
}
module.exports = User 