const usersCollection = require('../db').db().collection('Authorized')

let User = function(data){
  this.data = data
  this.errors = []
}

User.prototype.login = function(){
  return new Promise((resolve,reject)=>{
    this.cleanUp()

    usersCollection.findOne({email:this.data.email}).then((attemptedUser)=>{
      if(attemptedUser && attemptedUser.password == this.data.password){
        this.data = attemptedUser
        resolve()
      }
      else{
        this.errors.push('Invalid email/password!')
        reject(this.errors)
      }
    }).catch((error)=>{
      console.log(error)
      this.errors.push('Please Try Again Later!')
      reject(this.errors)
    })  
  })
}

User.prototype.cleanUp = function(){
  if(typeof(this.data.email)!= "string"){this.data.email = ""}
  if(typeof(this.data.password)!= "string"){this.data.password = ""}

  this.data = {
    email:    this.data.email.trim().toLowerCase(),
    password: this.data.password
  }
}

module.exports = User