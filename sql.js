const Client = require('pg').Client
const client = new Client({
  user: 'propval',
  host: process.env.PGHOST,
  database: 'propdb',
  password: 'BCParks',
  port: 5432,
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
        resolve(results.rows);
      })
    }) 
  }

  module.exports = {
      getDistrict
  }