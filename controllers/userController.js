const User = require("../models/User")

exports.login =(req,res)=>{
    let user= new User(req.body)
   
    user.login().then((result)=>{
      
        req.session.user = {favColor: "blue", username: user.data1.username} 
        
        req.session.save(()=>{
            res.redirect("/")
        })

    }).catch((err)=>{
       
        req.flash("errArray",err)
        req.session.save(()=>{
            res.redirect("/")
        })
    })       
}   
exports.logout=(req,res)=>{
   
    req.session.destroy(()=>{
        res.redirect("/")
    })
    
}
exports.register =(req,res)=>{
    
    let user= new User(req.body)
    user.cleanUp()
    user.register()
    if(user.errors.length){
        user.errors.forEach((error)=>{
             req.flash("regError",error)
        })
        req.session.save(()=>{
            res.redirect("/")
        })

    }
    else{
        req.flash("regSuccessfully","Register Successfully")
        req.session.save(()=>{
            res.redirect("/")
        })
        
    }
}
exports.home =(req,res)=>{
    
    if(req.session.user){
        res.render('home-dashboard',{nameofuser: req.session.user.username})
       
    }
    else{
        res.render('home-guest',{ errors: req.flash("errArray"), regError: req.flash("regError"), regSuccessfully : req.flash("regSuccessfully") })
    }
    
}