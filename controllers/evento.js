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
  Evento.find({}).sort('-date').exec((err, eventos)=>{

    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(eventos.length == 0)return res.status(501).send({message:'No hay entregas'})

    res.status(200).send(eventos)
  })
}

function saveEvento(req,res){
  let eventoJson = JSON.parse(req.body.eventoJson)
  delete eventoJson._id

  let evento = new Evento(eventoJson)

  evento.save((err, eventoStored)=>{
    if(err)return res.status(500).send({message :`Error al guardar el evento en la base de datos: ${err}`})
    let empresaId = eventoStored.empresa

    Empresa.findById(empresaId, (err, empresa) => {

      if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
      if(!empresa) return res.status(404).send({message:'La empresa no existe'})
      empresa.eventos.push(eventoStored._id)
      empresa.save((err)=>{
        if(err)return res.status(500).send(err)

        res.status(200).send(eventoStored)
      })
    })
  })
}

function updateEvento(req,res){
  let eventoJson = JSON.parse(req.body.eventoJson)
  let eventoId = req.params.eventoId

  Evento.findByIdAndUpdate(eventoId, eventoJson,  (err, eventoUpdated) =>{
    if(err) return res.status(500).send({message:`Error al editar la entrega de la base de datos ${err}`})
    if(eventoUpdated == undefined) return res.status(404).send('No se encontró el evento')

    res.status(200).send("Actualizacion exitosa")
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
