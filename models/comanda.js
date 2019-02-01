'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ComandaSchema = new Schema({
  mesero: {type: Schema.Types.ObjectId, ref: 'Empleado'},
  empresa: {type: Schema.Types.ObjectId, ref: 'Empresa'},
  cod: Number,
  addressEnd: String,
  addressStart: String,
  phone: String,
  nombreUser: String,
  date: Date,
  horaEntrega: Date,
  horaPago: Date,
  category: String,
  state: {type:Number, default: 0},
  modoPago: String,
  Valor_Efectivo: {type: Number, default: 0},
  Valor_Tarjeta: {type: Number, default: 0},
  productos: [{
    nombre: String,
    descripcion: String,
    imagen: String,
    precio: Number,
    cantidad: Number,
    entregado: {type: Boolean, default: false},
    caracteristicas: [{
      nombre: String,
      multiSeleccion: Boolean,
      opciones: [{
        nombre: String,
        precio: Number,
        estado:{type:Boolean, default: false}
      }]
    }]
  }],
  total: Number,
  comentario: String,
  city: String
})


module.exports = mongoose.model('Comanda',ComandaSchema)
