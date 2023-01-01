const planetsCollection = require('../db').db().collection('Exoplanets')
const usersCollection = require('../db').db().collection('Authorized')
const extractJson = require('../src/source.json')
const axios = require('axios')
const csvtojson = require("csvtojson")

let User = function(data){
  this.data = data
  this.errors = []
}

User.startEtlPipeline = function(){
  return new Promise(async(resolve,reject)=>{
    try{
      // Step:1 Extraction
      let promises = [
        User.extractFromApi('https://mocki.io/v1/7dec1516-4417-4542-b3d7-e69d9fc8794c'),
        User.extractFromApi('https://run.mocky.io/v3/ed3b5a89-4234-4428-8625-0a49a926602d'),
        csvtojson().fromFile('C:/Users/ADIL AHMAD/Desktop/ETL project/src/source.csv')
      ]

      let resolved_promises = await Promise.all(promises)
      let planets = [...resolved_promises.flat(), ...extractJson]
      
      // Step:2 Transformation
      planets = planets.map(planet => User.transformData(planet))

      // Step:3 Loading
      await planetsCollection.deleteMany()
      await planetsCollection.insertMany(planets)
      
      resolve()
    }
    catch(error){
      console.log(error)
      reject('Please Try Again Later!')
    }
  })
}

User.extractFromApi = function(url){
  return new Promise(async(resolve,reject)=>{
    try{
      let response = await axios.get(url)
      resolve(response.data)
    }
    catch(error){
      reject(error)
    }
  })
}

User.transformData = function(planet){
  return {
    name: planet.pl_name,
    neighbors: {
      stars: planet.sy_snum,
      planets: planet.sy_pnum
    },
    discovery: {
      method: planet.discoverymethod,
      year: planet.disc_year,
      facility: planet.disc_facility
    },
    orbital_period: {
      value: planet.pl_orbper,
      error: User.computeErrorThreshold(planet.pl_orbpererr1, planet.pl_orbpererr2)
    },
    radius:{
      value: planet.pl_rade,
      error: User.computeErrorThreshold(planet.pl_radeerr1, planet.pl_radeerr2)
    }
  }
}

User.computeErrorThreshold = function(err1, err2){
  if(err1 === "" || err2 === ""){
    return ""
  } 
  else if(Math.abs(err1) === Math.abs(err2)){
    return `±${Math.abs(err1)}`
  } 
  else{
    const max = Math.max(err1, err2)
    const min = Math.min(err1, err2)
    return `+${max}/${min}`
  }
}

User.api = function(){
  return new Promise(async(resolve,reject)=>{
    try{
      let exoplanets = await planetsCollection.find().toArray()
      resolve(exoplanets)
    }
    catch(error){
      console.log(error)
      reject('Please Try Again Later!')
    }
  })
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