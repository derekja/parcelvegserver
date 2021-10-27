const express = require('express')
const app = express()
const port = 3001

const sql = require('./sql')
require('dotenv').config()


app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
  })

app.get('/getDistrict', (req, res) => {
    sql.getDistrict()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  })


app.get('/parcel/:id', (req, res) => {
  sql.getParcelGeom(req.params.id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.get('/vri', (req, res) => {
  sql.getVRI(req.query.pids)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
  
  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })
