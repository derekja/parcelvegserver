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
  console.log('getParcelGeom', id)
  return new Promise(function(resolve, reject) {
    client.query('SELECT get_geoJSON1($1::numeric)', [id], (error, results) => {
      if (error) reject(error)

      if (!results) resolve(null)
      else resolve(results.rows);
    })
  }) 
}

let vriQuery = `
  SELECT json_build_object(
    'tree_type', line_3_tre,
              'parcel_id', pid,
              'parcel_area', parcel_area,
              'intersect_area', sum(intersection_area)
    )
    FROM     (
                      SELECT   vri.line_3_tre,
                              parcel.pid,
                              round((st_area(parcel.geom))::numeric,2) AS parcel_area,
                              round((st_area(st_intersection(vri.geom,parcel.geom)))::numeric,2) AS intersection_area
                      FROM     vri,
                              parcel
                      WHERE    parcel.pid=ANY(ARRAY[$1])
                      AND      st_intersects(vri.geom,parcel.geom)=true
                      AND      vri.line_3_tre IS NOT NULL
                      GROUP BY vri.line_3_tre,
                              parcel.pid,
                              parcel.geom,
                              vri.geom
                      ORDER BY parcel.pid,
                              vri.line_3_tre ) AS asd
    GROUP BY line_3_tre,
            pid,
            parcel_area
    ORDER BY pid,
            line_3_tre;
  `
const getVRI = (ids) => {
  console.log('getVRI', ids)
  return new Promise(function(resolve, reject) {
    client.query(vriQuery, [ids], (error, results) => {
      if (error) reject(error)

      if (!results) resolve(null)
      else resolve(results.rows);
    })
  }) 
}

  module.exports = {
      getDistrict,
      getParcelGeom,
      getVRI
  }