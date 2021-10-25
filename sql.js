const Client = require('pg').Client
const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});
client.connect(err => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }
  })  
const getDistrict = () => {
  console.log('getDistrict')
  return new Promise(function(resolve, reject) {
    client.query("select regional_d from parcel WHERE parcel_nam='015417271'", (error, results) => {
      if (error) {
        reject(error)
      }
      if (results === undefined) resolve(null)
      resolve(results.rows);
    })
  }) 
}


const getParcelGeom = (id) => {
  console.log('getParcelGeom')
  return new Promise(function(resolve, reject) {
    client.query('SELECT get_geoJSON($1)', [id], (error, results) => {
      if (error) {
        reject(error)
      }
      console.log("results", results)
      if (!results) resolve(null)
      resolve(results.rows);
    })
  }) 
}

  module.exports = {
      getDistrict,
      getParcelGeom
  }