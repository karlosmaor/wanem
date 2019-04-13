'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const EmpleadoSchema = new Schema({
  email: {type: String, unique: true, required: true, lowercase: true},
  password: String,
  name: String,
  phone: String,
  address: String,
  tipo: String,
  empresa: {type: Schema.Types.ObjectId, ref: 'Empresa'},
  ingresoDate: [Date]
})

module.exports = mongoose.model('Empleado',EmpleadoSchema)
