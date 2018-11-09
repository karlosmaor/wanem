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
  Pedido.find({}).limit(15).sort('-date').populate('productos.empresa').exec((err, pedidos)=>{

    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(pedidos.length == 0)return res.status(501).send({message:'No hay entregas'})

    res.status(501).send(pedidos)
  })
}

function savePedido(req,res){

  let pedidoJson = JSON.parse(req.body.pedidoJson)
  pedidoJson.date = new Date()
  delete pedidoJson._id

  if(pedidoJson.user.length < 2) delete pedidoJson.user

  if(pedidoJson.productos.length > 0){
    pedidoJson.productos.forEach(function(prod){
      prod.empresa = prod.iden.split(",")[1]
    })
  }

  let pedido = new Pedido(pedidoJson)

  pedido.save((err, pedidoStored)=>{
    if(err)return res.status(500).send({message :`Error al guardar la entrega en la base de datos: ${err}`})
    if(!pedidoStored) res.status(500).send({message :`Error al guardar la entrega en la base de datos: ${err}`})

    if(pedido.user != undefined){
      let userId = pedidoStored.user

      User.findById(userId, (err, client)=>{
        if(err) return res.status(500).send(err)

        if(pedido.phone != undefined) client.phone = pedido.phone
        if(pedido.addressEnd != undefined) client.address = pedido.addressEnd
        if(pedido.nombreUser != undefined) client.name = pedido.nombreUser
        client.pedidos.push(pedido._id)

        client.save((err)=>{
          if(err)return res.status(500).send(err)

          res.status(200).send(pedidoStored)
        })
      })
    }else{
      res.status(200).send(pedidoStored)
    }
  })
}

function updatePedido(req,res){

  let pedidoJson = JSON.parse(req.body.pedidoJson)
  let pedidoId = req.params.pedidoId
  delete pedidoJson.user

  Pedido.findByIdAndUpdate(pedidoId, pedidoJson,  (err, pedidoUpdated) =>{
    if(err) return res.status(500).send({message:`Error al editar la entrega de la base de datos ${err}`})
    if(pedidoUpdated == undefined) return res.status(404).send('No se encontró el pedido')

    res.status(200).send(pedidoUpdated)
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
