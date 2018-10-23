'use strict'

const mongoose = require('mongoose')
const Empresa = require('../models/empresa')
const Schema = mongoose.Schema

const InfoSchema = new Schema({
  logo1: String,
  logo2: String,
  description: String,
  valorDomicilio1: Number,
  valorDomicilio2: Number,
  ImagesPromo : [{
    img: String,
    iden: String
  }],
  categorias: [{
    name: String,
    image: String,
    visible: Boolean,
    empresas: [{type: Schema.Types.ObjectId, ref: 'Empresa'}]
  }],
  version: Number,
  city: String,
  date: Date,
  eventos: [{type: Schema.Types.ObjectId, ref: 'Evento'}]
})

module.exports = mongoose.model('Info',InfoSchema)
