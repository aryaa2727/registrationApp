// import express module to create server
const express = require("express")

// Importing router.js file
// to established communication betweem both app.js and router.js files
const router=require('./router.js')
//whatever you exported from router.js file will stored in router variable 
// console.log(router)


// importing session module for session data
const session=require('express-session')
// importing  connect-mongo mudule to store session data on mongodb
const Mongostore= require('connect-mongo')
//importing flash module for to disply flash msg
const flash =require("connect-flash")

// Create express server
const server=express()


// here we configure session that will be  stored on mongodb when server get incomming req from browser
let  sessionOption=session({
    secret: "javascript is my love",
    store: new Mongostore({client: require("./db")}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
})


// server use seesion and flash features
server.use(sessionOption)
server.use(flash())





server.use(express.urlencoded({extended:false}))

// To recognize incoming request data as an josn object for that we use json()
server.use(express.json())

// express access static file
server.use(express.static('public'))

// ejs is Template engine we use in this project but to use ejs we have to install ejs package with help of npm 
server.set('view engine','ejs')

// here we use router
server.use('/',router)

// Here we export only server module not whole app.js file
module.exports = server