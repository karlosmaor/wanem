'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PedidoSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  addressEnd: String,
  phone: String,
  nombreUser: String,
  date: Date,
  category: String,
  state: {type:Number, default: 0},
  modoPago: String,
  Valor_Domicilio: {type: Number, default: 0},
  Valor_Productos: {type: Number, default: 0},
  Valor_Tarjeta: {type: Number, default: 0},
  productos: [{
    nombre: String,
    descripcion: String,
    address: String,
    empresa: {type: Schema.Types.ObjectId, ref: 'Empresa'},
    imagen: String,
    iden: String,
    precio: Number,
    cantidad: Number,
    entregado: Boolean,
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
  city: String,
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
