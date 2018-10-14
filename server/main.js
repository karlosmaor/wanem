'use strict'

const mongoose =  require('mongoose')
const app  = require('./app')
const config = require('../config')
//const websocket = require('../websocket/server/main')

mongoose.connect(config.db, (err,res)=>{
  if(err){
    return console.log(`Error al conectarse a la base de datos: ${err}`);
  }
  console.log('Conexion a la base de datos exitosa...')

  app.listen(config.port, () => {
    console.log('API REST corriendo exitosamente')
  })
})
