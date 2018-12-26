'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EventoSchema = new Schema({
  empresa: {type: Schema.Types.ObjectId, ref: 'Empresa'},
  name: String,
  address: String,
  description: String,
  precio: Number,
  date: Date,
  ImagesPromo: {
    img: String,
    iden: String,
    pos: Number
  },
  caracteristicas: [{
    nombre: String,
    multiSeleccion: Boolean,
    opciones: [{
      nombre: String,
      precio: Number
    }]
  }]
})


module.exports = mongoose.model('Evento',EventoSchema)
