'use strict'

const mongoose = require('mongoose')
const Evento =  require('../models/evento')
const Empresa =  require('../models/empresa')
const config = require('../config')

function getEvento(req,res){
  let eventoId = req.params.eventoId

  Evento.findById(eventoId).populate('empresa', 'name').exec((err, evento) => {

    if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(!evento) return res.status(404).send({message:'Esa entrega no existe'})

  res.status(200).send(evento)
  })
}

function getEventos(req, res){
  Evento.find({}).limit(15).sort('-date').exec((err, eventos)=>{

    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(eventos.length == 0)return res.status(501).send({message:'No hay entregas'})

    res.status(200).send(eventos)
  })
}

function saveEvento(req,res){

  console.log(req.body);
  console.log(req.body.evento.empresa);

  res.status(200).send("Muy perfecto")
/*
  let evento = new Evento()
  evento.empresa = req.body.empresa
  evento.name = req.body.name
  evento.address = req.body.address
  evento.description = req.body.description
  evento.precio = req.body.precio
  if(req.body.position != undefined) evento.position = JSON.parse(req.body.position)
  if(req.body.caracteristicas != undefined) evento.carateristicas = JSON.parse(req.body.carateristicas)
  evento.date = new Date()

  evento.save((err, eventoStored)=>{
    if(err)return res.status(500).send({message :`Error al guardar la entrega en la base de datos: ${err}`})
    let empresaId = eventoStored.empresa

    Empresa.findById(empresaId, (err, client) => {

      if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
      if(!client) return res.status(404).send({message:'La empresa no existe'})
      client.eventos.push(eventoStored._id)
      client.save((err)=>{
        if(err)return res.status(500).send(err)

        res.status(200).send(eventoStored)
      })
    })
  })
  */
}

function updateEvento(req,res){

  let eventoId = req.params.eventoId
  let update = req.body
  if(req.body.position != undefined) evento.position = JSON.parse(req.body.position)
  if(req.body.caracteristicas != undefined) evento.carateristicas = JSON.parse(req.body.carateristicas)

  Evento.findByIdAndUpdate(eventoId, update,  (err, eventoUpdated) =>{
    if(err) return res.status(500).send({message:`Error al editar la entrega de la base de datos ${err}`})
    if(eventoUpdated == undefined) return res.status(404).send('No se encontró el evento')

    Evento.findById(eventoUpdated._id).exec((err, eventoNew)=>{
      if(err) return res.status(500).send(err)
      res.status(200).send(eventoNew)

      // if((eventoUpdated.state == 0 && eventoNew.state == 1)||(eventoUpdated.state == 0 && eventoNew.state == 4)) {
      //   var JsonEvento = JSON.stringify(eventoNew)
      //   firebase.SendNotificationDomiciliarios(config.state1,JsonEvento, "delete")
      // }
      // if((eventoUpdated.state == 1 && eventoNew.state == 0)||(eventoUpdated.state == 2 && eventoNew.state == 0)) {
      //   var JsonEvento = JSON.stringify(eventoNew)
      //   firebase.SendNotificationDomiciliarios(config.state1,JsonEvento, "add")
      // }
      // if (eventoUpdated.state == 1 && eventoNew.state == 2){
      //   Domiciliario.findByIdAndUpdate(eventoNew.domiciliario,{state: 3},(err, domiciliarioUpdated)=>{
      //     if(err)return res.status(500).send(err)
      //     res.status(200).send(eventoNew)
      //   })
      // }else {
      //   res.status(200).send(eventoNew)
      // }
    })
  })
}

function deleteEvento(req,res){
  let eventoId = req.params.eventoId
  Evento.findById(eventoId, (err, evento) =>{
    if(err) return res.status(500).send({message:`Error al borrar la entrega de la base de datos ${err}`})

    evento.remove(err =>{
        if(err)return res.status(500).send({message:`Error al borrar la entrega de la base de datos ${err}`})
        res.status(200).send({message:'La entrega ha sido borrada.'})
    })
  })
}

module.exports ={
  getEvento,
  getEventos,
  saveEvento,
  updateEvento,
  deleteEvento
}
