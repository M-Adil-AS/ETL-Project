const planetsCollection = require('../db').db().collection('Exoplanets')
const axios = require('axios')
const csv = require('csv-parser');
const { Transform } = require('stream');
const JSONStream = require('JSONStream');
const CombinedStream = require('combined-stream');

let Process = function(data){
    this.data = data
    this.errors = []
}

const arrayTransform = new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) { 
      chunk = Process.transformData(chunk)
      callback(null, chunk);
    }
});
  
Process.ETL_pipeline = function(){
    return new Promise(async(resolve,reject)=>{
      try{
        // Step:1 Extraction
        let [stream1, stream2, stream3, stream4] = await Promise.all([
          Process.getStream('https://mocki.io/v1/7dec1516-4417-4542-b3d7-e69d9fc8794c', 'API'),
          Process.getStream('https://run.mocky.io/v3/2aa93ac1-c240-4823-8c10-f1a3f39a0bee', 'API'),
          Process.getStream('https://raw.githubusercontent.com/M-AdilAhmad/ETL-data/main/source.json', 'JSON'),
          Process.getStream('https://raw.githubusercontent.com/M-AdilAhmad/ETL-data/main/source.csv', 'CSV')
        ]);
  
        stream1 = stream1.pipe(JSONStream.parse('*'))
        stream2 = stream2.pipe(JSONStream.parse('*'))
        stream3 = stream3.pipe(JSONStream.parse('*'))
        stream4 = stream4.pipe(csv())
  
        let combinedStream = CombinedStream.create();
        combinedStream.append(stream1);
        combinedStream.append(stream2);
        combinedStream.append(stream3);
        combinedStream.append(stream4);
  
        // Step:2 Transform
        let transformedStream = combinedStream.pipe(arrayTransform)
   
        // Step:3 Load
        await planetsCollection.deleteMany()
        
        const bulkOp = planetsCollection.initializeUnorderedBulkOp();
  
        transformedStream.on('data', (chunk) => {
          bulkOp.insert(chunk); // Add insert operation to the bulk operation
        });
  
        transformedStream.on('error', (error) => {
          console.log(error)
        });
  
        transformedStream.on('end', async () => {
          await bulkOp.execute(); // Execute the bulk operation
        });
        
        resolve()
      }
      catch(error){
        console.log(error)
        reject('Please Try Again Later!')
      }
    })
}
  
Process.getStream = function(url, src){
    return new Promise(async(resolve,reject)=>{
      try{
        let response = await axios.get(url, { responseType: 'stream' })
        resolve(response.data)
      }
      catch(error){
        reject(error)
      }
    })
}
  
Process.transformData = function(planet){
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
        error: Process.computeErrorThreshold(planet.pl_orbpererr1, planet.pl_orbpererr2)
      },
      radius:{
        value: planet.pl_rade,
        error: Process.computeErrorThreshold(planet.pl_radeerr1, planet.pl_radeerr2)
      }
    }
}
  
Process.computeErrorThreshold = function(err1, err2){
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

Process.getExoplanets = function(){
    return new Promise(async(resolve,reject)=>{
      try{
        const cursor = planetsCollection.find({});
        resolve(cursor);
      }
      catch(error){
        console.log(error)
        reject('Please Try Again Later!')
      }
    })
}

module.exports = Process