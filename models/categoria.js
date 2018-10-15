'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategoriaSchema = new Schema({
  name: String,
  image: String,
  visible: Boolean,
  empresas: [{type: Schema.Types.ObjectId, ref: 'Empresa'}]
})

module.exports = mongoose.model('Categoria',CategoriaSchema)
