const Process = require('../models/Process')

exports.ETL = function(req,res){
    Process.ETL_pipeline().then(()=>{
      req.flash('success', 'ETL Process Successful!')
      req.session.save(()=>{
        res.redirect(`/`)
      }) 
    }).catch((error)=>{
      req.flash('error', error)
      req.session.save(()=>{
        res.redirect(`/`)
      }) 
    })
}
  
exports.exoplanets = function(req, res) {
    Process.getExoplanets()
    .then(cursor => {     
      cursor.stream().on('data', doc => {       
        res.write(JSON.stringify(doc) + '\n')  // Send each JSON object as a chunk to the frontend
      })

      cursor.stream().on('error', (error) => {
        console.log(error)
      })
  
      cursor.stream().on('end', () => {
        res.end()
      })
    })
    .catch(error => {
      res.json({ error: 'Please Try Again Later!' })
    })
}