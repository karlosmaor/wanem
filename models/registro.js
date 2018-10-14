'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RegistroSchema = new Schema({
  version: Number,
  categoria: String,
  date: Date
})

module.exports = mongoose.model('Registro',RegistroSchema)
