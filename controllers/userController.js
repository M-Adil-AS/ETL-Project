const User = require('../models/User')

exports.login = function(req,res){
  let user = new User(req.body)
  user.login().then(()=>{
    req.session.user = {id:user.data._id}

    req.session.save(()=>{
      res.redirect('/')
    }) 
  }).catch((errors)=>{
    errors.forEach((error)=>{
      req.flash('errors',error)
    })
    req.session.save(()=>{
      res.redirect('/')
    })
  })  
}

exports.home = function(req, res){
  res.render('home-guest',{errors:req.flash('errors'), success:req.flash('success'), cssFile:'/home-guest.css'})
}

exports.exoplanets_screen = function(req, res){
  res.render('exoplanets',{errors:req.flash('errors'), success:req.flash('success'), cssFile:'/exoplanets.css', script:'/exoplanets.js'})
}

exports.logout = function(req,res){
  req.session.destroy(()=>{
    res.redirect('/')
  })
}

exports.mustBeLoggedIn = function(req,res,next){
  if(req.session.user){
    next()
  }
  else{
    req.flash('errors','You must be logged in to perform that action!')
    req.session.save(()=>{
      res.redirect('/')
    })
  }
}