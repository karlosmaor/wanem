'use strict'

const mongoose = require('mongoose')
const Domiciliario = require('../models/domiciliario')
const service = require('../services')

function getDomiciliario(req,res){
  let domiciliarioId = req.params.domiciliarioId

  Domiciliario.findById(domiciliarioId, (err, domiciliario) => {

    if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(!domiciliario) return res.status(404).send({message:'El domiciliario no existe'})

  res.status(200).send(domiciliario)
  })
}

function getDomiciliarios(req, res){
  Domiciliario.find({}, (err, domiciliarios)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(domiciliarios.length == 0)return res.status(501).send({message:'No hay domiciliarios registrados'})

    res.status(200).send( domiciliarios )
  })
}

function updateDomiciliario(req,res){
  let domiciliarioId = req.params.domiciliarioId

  let update = req.body
  if(update.position != undefined) update.position = JSON.parse(update.position)
  if(update.deliveries != undefined) update.deliveries = JSON.parse(update.deliveries)

  Domiciliario.findByIdAndUpdate(domiciliarioId, update, function(err, domiciliarioUpdated){
    if(err) return res.status(500).send({message:`Error al editar el domiciliario en la base de datos ${err}`})

    if(update.password != undefined){
      Domiciliario.findById(domiciliarioId, (err, dom)=>{
        if(err) return res.status(500).send(err)
        dom.password = update.password
        dom.save((err)=>{
          if(err) return res.status(500).send(err)

        })
      })
    }
    if(domiciliarioUpdated == undefined) return res.status(404).send('No se encontró el domiciliario.')
    Domiciliario.findById(domiciliarioId, (err, dom)=>{
      if(err) return res.status(500).send(err)

        res.status(200).send(dom)
    })
  })
}

function deleteDomiciliario(req,res){
  let domiciliarioId = req.params.domiciliarioId
  Domiciliario.findById(domiciliarioId, (err, domiciliario) =>{
    if(err) return res.status(500).send({message:`Error al eliminar al domiciliario de la base de datos ${err}`})

    if(domiciliario == null)return res.status(404).send({message:'Domiciliario no encontrado'})

    domiciliario.remove(err =>{
        if(err)return res.status(500).send({message:`Error al borrar el domiciliario de la base de datos ${err}`})
        res.status(200).send({message:'El domiciliario ha sido borrado.'})
    })
  })
}

function signUp(req,res){
  const domiciliario = new Domiciliario()
  domiciliario.email = req.body.email
  domiciliario.password = req.body.password
  domiciliario.name = req.body.name
  domiciliario.id = req.body.id
  domiciliario.avatar = req.body.avatar
  domiciliario.phone = req.body.phone
  domiciliario.category = req.body.category
  domiciliario.coins = req.body.coins
  domiciliario.debt = req.body.debt
  domiciliario.tokenNotification = req.body.tokenNotification
  domiciliario.signupDate = new Date()

  Domiciliario.find({email: req.body.email}, (err,dom) =>{
    if(err) return res.status(500).send({message: err})

    if(dom.length != 0) return res.status(501).send({message: 'EL correo ya existe en nuestra base de datos'})

    Domiciliario.find({id: req.body.id}, (err,dom) =>{
      if(err) return res.status(500).send({message: err})

      if(dom.length != 0) return res.status(502).send({message: 'El numero de identificación ya existe en nuestra base de datos'})

      domiciliario.save((err)=>{
        if(err) return res.status(500).send({message: `Error registrando nuevo domiciliario: ${err}`})

        res.status(201).send({
          token: service.createToken(domiciliario),
          domiciliario: domiciliario
        })
      })
    })
  })
}

function signIn(req,res){
  Domiciliario.findOne({email: req.body.email}, (err, domiciliario)=>{
    if(err) return res.status(500).send({message: err})
    if(!domiciliario) return res.status(404).send('No existe el usuario')

    domiciliario.comparePass(req.body.password,(isMatch)=>{
      if(isMatch){
        var update = {lastLogin:new Date()}
        Domiciliario.findByIdAndUpdate(domiciliario._id, update, (err, domiciliarioUpdated) =>{
          if(err) return res.status(500).send({message:`Error al editar el Client en la base de datos ${err}`})

          res.status(200).send({
            token: service.createToken(domiciliario),
            domiciliario: domiciliario
          })

        })
      }else {
        res.status(401).send('Contraseña incorrecta')
      }
    })
  })
}

function search(req, res){

  Domiciliario.find(req.body, (err, domiciliarios)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(domiciliarios.length == 0)return res.status(501).send({message:'No hay domiciliarios registrados'})

    res.status(200).send( domiciliarios )
  })
}

module.exports = {
  getDomiciliario,
  getDomiciliarios,
  deleteDomiciliario,
  updateDomiciliario,
  signUp,
  signIn,
  search
}
