'use strict'

require('isomorphic-fetch')
const mongoose = require('mongoose')
const Pedido =  require('../models/pedido')
const Comanda =  require('../models/comanda')
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

    res.status(200).send(pedidos)
  })
}

function getPedidosEmpresas(req, res){
  var fecha = new Date()
  var start = new Date()
  var end = new Date()
  start.setHours(5,0,0,0)
  end.setHours(5,0,0,0)
  if(fecha<start){
    start.setHours(start.getHours()-24)
  }else {
    end.setHours(end.getHours()+24)
  }
  Pedido.find({
    state: {'$gte': 1,'$lte': 3},
    date: {'$gte': start,'$lte': end}
  }).limit(15).sort('-date').populate('productos.empresa').exec((err, pedidos)=>{

    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(pedidos.length == 0)return res.status(501).send({message:'No hay entregas'})

    res.status(200).send(pedidos)
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
//-------------Envio de emails-----------------------------------
 fetch('http://paramismejoresamigos.top/wanem/enviarmail.php', {
   method: 'POST',
   headers: {'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
   body: 'pedido=Hay un nuevo Pedido'
}).then(res=>res.json())
//--------------------------------------------------------------------
  let pedido = new Pedido(pedidoJson)

  console.log(pedido);

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
//Creando pedidos para la caja de los restaurantes
  /*if(pedidoJson.state == 1 && pedidoJson.category != 'Moto_Empresa'){
    let comandaNueva = new Comanda({
      state:0,
      Valor_Domicilio:3500,
      Valor_Productos:comanda.total,
      addressEnd:comanda.addressEnd,
      category:'Moto_Empresa',
      city:comanda.city,
      comentario:comanda.comentario.concat(' - No es necesario llamar al cliente'),
      modoPago:'efectivo',
      nombreUser:comanda.nombreUser,
      phone:comanda.phone,
      total:comanda.total+3500,
      date:new Date(),
      user:miCliente._id
    })
    pedidoNuevo.productos = []
    comanda.productos.forEach(function(produ){
      var newProducto = {
        cantidad:produ.cantidad,
        caracteristicas:produ.caracteristicas,
        descripcion:produ.descripcion,
        imagen:produ.imagen,
        nombre:produ.nombre,
        precio:produ.precio,
        empresa:comanda.empresa
      }
      pedidoNuevo.productos.push(newProducto)
    })
    pedidoNuevo.save((err,pedidoGuardado)=>{
      if(err) return res.status(500).send({message: `Error registrando nuevo pedido en wanem: ${err}`})

    })
  }*/
//
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
  getPedidosEmpresas,
  savePedido,
  updatePedido,
  deletePedido,
  search,
  searchState
}
