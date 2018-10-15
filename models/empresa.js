'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const EmpresaSchema = new Schema({
  email: {type: String, unique: true, required: true, lowercase: true},
  password: {type:String, select:false, required: true},
  name: String,
  avatar: String,
  address: [String],
  city: String,
  phone: String,
  description: String,
  category: String,
  tipo : String,
  visible: Boolean,
  pedidos: [{type: Schema.Types.ObjectId, ref: 'Pedido'}],
  ImagesPromo : [{
    img: String,
    iden: String
  }],
  eventos: [{type: Schema.Types.ObjectId, ref: 'Evento'}],
  categorias: [{
    nombre: String,
    imagen: String,
    productos: [{
      nombre: String,
      imagen: String,
      descripcion: String,
      precio: Number,
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
  position: {
    lat: {type: Number, default: 0.0},
    lng: {type: Number, default: 0.0}
  },
  schedule: [{hs:Number,ms:Number,he:Number,me:Number}],
  signupDate: Date,
  lastLogin: Date
})

EmpresaSchema.pre('save',function(next){

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

EmpresaSchema.methods.comparePass = function (pass,isMatch) {
  mongoose.model('Empresa', EmpresaSchema).findOne({ email: this.email },'password', (err, empresa) => {
        bcrypt.compare(pass, empresa.password, function(err, res) {
          if (err)return console.log({ message: err })
          isMatch(res)
        });
    });

}

module.exports = mongoose.model('Empresa',EmpresaSchema)
