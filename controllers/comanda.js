'use strict'

require('isomorphic-fetch')
const mongoose = require('mongoose')
const Comanda =  require('../models/comanda')
const User =  require('../models/user')
const config = require('../config')

function getComanda(req,res){
  let comandaId = req.params.comandaId

  Comanda.findById(comandaId).exec((err, comanda) => {

    if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(!comanda) return res.status(404).send({message:'Esa entrega no existe'})

  res.status(200).send(comanda)
  })
}

function getComandas(req, res){
  Comanda.find({}).limit(15).sort('-date').exec((err, comandas)=>{

    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(comandas.length == 0)return res.status(501).send({message:'No hay entregas'})

    res.status(200).send(comandas)
  })
}

function getComandasDia(req, res){

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
  start.setHours(start.getHours()-24)
  end.setHours(end.getHours()-24)
  Comanda.find({
    empresa: req.body.empresaId,
    addressStart: req.body.addressStart,
    state: {'$lte': 3},
    date: {'$gte': start,'$lte': end}
  }).sort('-date').exec((err, comandas)=>{

    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(comandas.length == 0)return res.status(501).send({message:'No hay pedidos pendientes'})

    const comandasNuevas = comandas.filter(x => x.state == 1)
    if(comandasNuevas.length>0){
      Comanda.update({state:1,empresa:req.params.empresaId}, {state:1}, {multi:true}, (err,doc) =>{
        if(err)return res.status(500).send({message:`Error al realizar la actualización ${err}`})
          res.status(200).send(comandas)
      })
    }else{
        res.status(201).send('ok')
    }
  })
}

function getComandasActuales(req, res){

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
//  start.setHours(start.getHours()-24)
// end.setHours(end.getHours()-24)
  Comanda.find({
    empresa: req.body.empresaId,
    addressStart: req.body.addressStart,
    state: {'$lte': 3},
    date: {'$gte': start,'$lte': end}
  }).sort('-date').exec((err, comandas)=>{

    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(comandas.length == 0)return res.status(501).send({message:'No hay pedidos pendientes'})

    res.status(200).send(comandas)
  })
}

function saveComanda(req,res){

  let comandaJson = JSON.parse(req.body.comandaJson)
  comandaJson.date = new Date()
  delete comandaJson._id

  if(comandaJson.mesero.length < 2) delete comandaJson.mesero
  if(comandaJson.empresa.length < 2) delete comandaJson.empresa

  let comanda = new Comanda(comandaJson)

  Comanda.countDocuments({state:{'$lte': 6}}, (err,c) => {
    if(err) return res.status(500).send({message :`Error al contando los pedidos: ${err}`})

    comanda.cod = c

    comanda.save((err, comandaStored)=>{
      if(err)return res.status(500).send({message :`Error al guardar la entrega en la base de datos: ${err}`})
      if(!comandaStored) res.status(500).send({message :`Error al guardar la entrega en la base de datos: ${err}`})

      if(comanda.phone.length > 3){

        User.findOne({email: comanda.phone}, (err, client)=>{
          if(err) return res.status(500).send(err)

          if(!client){
            let newUser = new User({email: comanda.phone, name: comanda.nombreUser, phone: comanda.phone, address: comanda.addressEnd, city: comanda.city, signupDate: new Date(), lastLogin: new Date()})

            newUser.save((err,userStored)=>{
              if(err) return res.status(500).send({message: `Error registrando nuevo Empleado: ${err}`})

              res.status(200).send(comandaStored)
            })
          }else {
            client.lastLogin = new Date()
            client.address = comanda.addressEnd
            client.name = comanda.nombreUser
            client.save((err,userStored)=>{
              if(err) return res.status(500).send({message: `Error registrando nuevo Empleado: ${err}`})

              res.status(200).send(comandaStored)
            })
          }
        })
      }else{
        res.status(200).send(comandaStored)
      }
    })
  })
}
/* states:
0 = Pedido nuevo
1 = Pedido Impreso
2 = Pedido entregado
3 = Pedido Pendiente
4 = Pedido pagado
5 = Pedido fallido
10 = base
11 = Gasto
12 = Ingreso
*/

function updateComanda(req,res){

  let comandaJson = JSON.parse(req.body.comandaJson)
  let comandaId = req.params.comandaId

  if(comandaJson.state == 2){
    comandaJson.horaEntrega = new Date()
  }else if(comandaJson.state == 4){
    comandaJson.horaPago = new Date()
  }

  Comanda.findByIdAndUpdate(comandaId, comandaJson,  (err, comandaUpdated) =>{
    if(err) return res.status(500).send({message:`Error al editar la entrega de la base de datos ${err}`})
    if(comandaUpdated == undefined) return res.status(404).send('No se encontró el comanda')

    res.status(200).send(comandaUpdated)
  })
}

function deleteComanda(req,res){
  let comandaId = req.params.comandaId
  Comanda.findById(comandaId, (err, comanda) =>{
    if(err) return res.status(500).send({message:`Error al borrar la entrega de la base de datos ${err}`})

    comanda.remove(err =>{
        if(err)return res.status(500).send({message:`Error al borrar la entrega de la base de datos ${err}`})
        res.status(200).send({message:'La entrega ha sido borrada.'})
    })
  })
}

function search(req,res){
  let date1 = req.body.date1
  let date2 = req.body.date2

  Comanda.find({
    date: {
      '$gte': new Date(date1),
      '$lte': new Date(date2)
    }
  },(err, comandas) => {
    if(err)return res.status(500).send({message:`Error: ${err}`})

    if(comandas.length == 0) return res.status(501).send({message:'No hay entregas'})

    res.status(200).send(comandas)
  })
}

function searchState(req, res){
  Comanda.find(req.body).exec((err, comandas)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(comandas.length == 0)return res.status(501).send({message:'No hay entregas'})

    res.status(200).send(comandas)
  })
}

function CargarBase(req,res) {
  Comanda.find({state:{'$gte': 4}, empresa: req.body.empresaId, addressStart: req.body.addressStart}).limit(1).sort('-date').exec((err, comandas)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(comandas.length == 0)return res.status(501).send({message:'No hay comandas'})

    res.status(200).send(comandas[0])
  })
}

module.exports ={
  getComanda,
  getComandas,
  getComandasDia,
  getComandasActuales,
  saveComanda,
  updateComanda,
  deleteComanda,
  search,
  searchState,
  CargarBase
}
