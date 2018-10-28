'use strict'

const mongoose = require('mongoose')
const Pedido =  require('../models/pedido')
const User =  require('../models/user')
const config = require('../config')

function getPedido(req,res){
  let pedidoId = req.params.pedidoId

  Pedido.findById(pedidoId).populate('user', 'name').exec((err, pedido) => {

    if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(!pedido) return res.status(404).send({message:'Esa entrega no existe'})

  res.status(200).send(pedido)
  })
}

function getPedidos(req, res){
  Pedido.find({}).limit(15).sort('-date').exec((err, pedidos)=>{

    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(pedidos.length == 0)return res.status(501).send({message:'No hay entregas'})

    res.status(200).send(pedidos)
  })
}

function savePedido(req,res){

  let pedidoJson = JSON.parse(req.body.pedidoJson)
  pedidoJson.date = new Date()

  let pedido = new Pedido(pedidoJson)

  pedido.save((err, pedidoStored)=>{
    if(err)return res.status(500).send({message :`Error al guardar la entrega en la base de datos: ${err}`})
    let userId = pedidoStored.user

    User.findById(userId, (err, client) => {

      if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
      if(!client) return res.status(404).send({message:'El cliente no existe'})
      client.pedidos.push(pedidoStored._id)
      client.save((err)=>{
        if(err)return res.status(500).send(err)
        res.status(200).send(pedidoStored)
        /*Pedido.findById(pedidoStored._id).populate({path:'user', select:['name', 'phone']}).exec((err, pedidoEnvio)=>{
          var JsonPedido = JSON.stringify(pedidoEnvio)
        //  firebase.SendNotificationDomiciliarios(config.state1,JsonPedido,"add")
          res.status(200).send(pedidoStored)
        })*/
      })
    })
  })
}

function updatePedido(req,res){

  let pedidoId = req.params.pedidoId
  let update = req.body
  //if(req.body.positionStart != undefined) update.positionStart = JSON.parse(req.body.positionStart)
//  if(req.body.positionEnd != undefined) update.positionEnd = JSON.parse(req.body.positionEnd)

  Pedido.findByIdAndUpdate(pedidoId, update,  (err, pedidoUpdated) =>{
    if(err) return res.status(500).send({message:`Error al editar la entrega de la base de datos ${err}`})
    if(pedidoUpdated == undefined) return res.status(404).send('No se encontró el pedido')

    Pedido.findById(pedidoUpdated._id).populate('user', 'name').exec((err, pedidoNew)=>{
      if(err) return res.status(500).send(err)
      res.status(200).send(pedidoNew)

      // if((pedidoUpdated.state == 0 && pedidoNew.state == 1)||(pedidoUpdated.state == 0 && pedidoNew.state == 4)) {
      //   var JsonPedido = JSON.stringify(pedidoNew)
      //   firebase.SendNotificationDomiciliarios(config.state1,JsonPedido, "delete")
      // }
      // if((pedidoUpdated.state == 1 && pedidoNew.state == 0)||(pedidoUpdated.state == 2 && pedidoNew.state == 0)) {
      //   var JsonPedido = JSON.stringify(pedidoNew)
      //   firebase.SendNotificationDomiciliarios(config.state1,JsonPedido, "add")
      // }
      // if (pedidoUpdated.state == 1 && pedidoNew.state == 2){
      //   Domiciliario.findByIdAndUpdate(pedidoNew.domiciliario,{state: 3},(err, domiciliarioUpdated)=>{
      //     if(err)return res.status(500).send(err)
      //     res.status(200).send(pedidoNew)
      //   })
      // }else {
      //   res.status(200).send(pedidoNew)
      // }
    })
  })
}

function deletePedido(req,res){
  let pedidoId = req.params.pedidoId
  Pedido.findById(pedidoId, (err, pedido) =>{
    if(err) return res.status(500).send({message:`Error al borrar la entrega de la base de datos ${err}`})

    pedido.remove(err =>{
        if(err)return res.status(500).send({message:`Error al borrar la entrega de la base de datos ${err}`})
        res.status(200).send({message:'La entrega ha sido borrada.'})
    })
  })
}

function search(req,res){
  let date1 = req.body.date1
  let date2 = req.body.date2

  Pedido.find({
    date: {
      '$gte': new Date(date1),
      '$lte': new Date(date2)
    }
  },(err, pedidos) => {
    if(err)return res.status(500).send({message:`Error: ${err}`})

    if(pedidos.length == 0) return res.status(501).send({message:'No hay entregas'})

    res.status(200).send(pedidos)
  })
}

function searchState(req, res){
  Pedido.find(req.body).populate('user', 'name').exec((err, pedidos)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(pedidos.length == 0)return res.status(501).send({message:'No hay entregas'})

    res.status(200).send(pedidos)
  })
}

module.exports ={
  getPedido,
  getPedidos,
  savePedido,
  updatePedido,
  deletePedido,
  search,
  searchState
}
