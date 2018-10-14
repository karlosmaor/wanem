'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const UserSchema = new Schema({
  email: {type: String, unique: true, required: true, lowercase: true},
  name: String,
  phone: String,
  address: String,
  pedidos: [{type: Schema.Types.ObjectId, ref: 'Pedido'}],
  coins: {type: Number, default: 0},
  tokenNotification: String,
  position: {
    lat: {type: Number, default: 0.0},
    lng: {type: Number, default: 0.0}
  },
  signupDate: Date,
  lastLogin: Date
})

module.exports = mongoose.model('User',UserSchema)
