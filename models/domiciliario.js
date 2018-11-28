'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const DomiciliarioSchema = new Schema({
  email: {type: String, unique: true, required: true, lowercase: true},
  password: {type:String, select:false, required: true},
  name: String,
  avatar: String,
  phone: String,
  category: String,
  coins: {type: Number, default: 0},
  debt: {type: Number, default: 0},
  state: {type: Number, default: 0},
  pedidos: [{type: Schema.Types.ObjectId, ref: 'Pedido'}],
  position: {
    lat: {type: Number, default: 0.0},
    lng: {type: Number, default: 0.0}
  },
  signupDate: {type: Date, default: Date.now()},
  lastLogin: Date,
})

DomiciliarioSchema.pre('save',function(next){

  let dom = this
  if(dom.password == undefined) return next()

  bcrypt.genSalt(10, (err,salt)=>{
    if(err) return next()

    bcrypt.hash(dom.password, salt, null, (err, hash)=>{
      if(err) return next(err)

      dom.password = hash
      next()
    })
  })
})

DomiciliarioSchema.methods.comparePass = function (pass,isMatch) {
  mongoose.model('Domiciliario', DomiciliarioSchema).findOne({ email: this.email },'password', (err, domiciliario) => {
        bcrypt.compare(pass, domiciliario.password, function(err, res) {
          if (err)return console.log({ message: err })
          isMatch(res)
        });
    });

}

module.exports = mongoose.model('Domiciliario',DomiciliarioSchema)
