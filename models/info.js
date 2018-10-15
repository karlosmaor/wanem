'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InfoSchema = new Schema({
  logo1: String,
  logo2: String,
  description: String,
  valorDomicilio1: Number,
  valorDomicilio2: Number,
  categorias: [{type: Schema.Types.ObjectId, ref: 'Categoria'}],
  version: Number,
  city: String
})

module.exports = mongoose.model('Info',InfoSchema)
