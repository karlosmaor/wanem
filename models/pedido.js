'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PedidoSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  addressStart: String,
  addressEnd: String,
  date: Date,
  category: String,
  state: {type:Number, default: 0},
  empresas:[{
    empresa: {type: Schema.Types.ObjectId, ref: 'Empresa'},
    productos: [{
      nombre: String,
      precio: Number,
      cantidad: Number,
      caracteristicas: [{
        nombre: String,
        multiSeleccion: Boolean,
        opciones: [{
          nombre: String,
          precio: Number
        }]
      }]
    }]
  }],
  total: Number,
  comentario: String,
  positionStart: {
    lat: {type: Number, default: 0.0},
    lng: {type: Number, default: 0.0}
  },
  positionEnd: {
    lat: {type: Number, default: 0.0},
    lng: {type: Number, default: 0.0}
  }
})


module.exports = mongoose.model('Pedido',PedidoSchema)
