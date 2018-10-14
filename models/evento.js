'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EventoSchema = new Schema({
  empresa: {type: Schema.Types.ObjectId, ref: 'Empresa'},
  name: String,
  date: Date,
  address: String,
  description: String,
  precio: Number,
  caracteristicas: [{
    nombre: String,
    multiSeleccion: Boolean,
    opciones: [String],
    precios: [Number]
  }],
  position: {
    lat: {type: Number, default: 0.0},
    lng: {type: Number, default: 0.0}
  }
})


module.exports = mongoose.model('Evento',EventoSchema)
