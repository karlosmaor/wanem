'use strict'

const mongoose = require('mongoose')
const Info =  require('../models/info')
const Empresa =  require('../models/empresa')
const config = require('../config')

function getInfos(req, res){
  Info.find({}).limit(1).sort('-date').exec((err, infos)=>{

    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(infos.length == 0)return res.status(501).send({message:'No hay entregas'})

    res.status(200).send(infos[1])
  })
}

function saveInfo(req,res){

  let info = new Info()
  info.empresa = req.body.empresa
  info.name = req.body.name
  info.address = req.body.address
  info.description = req.body.description
  info.precio = req.body.precio
  if(req.body.position != undefined) info.position = JSON.parse(req.body.position)
  if(req.body.caracteristicas != undefined) info.carateristicas = JSON.parse(req.body.carateristicas)
  info.date = new Date()

  info.save((err, infoStored)=>{
    if(err)return res.status(500).send({message :`Error al guardar la entrega en la base de datos: ${err}`})
    let empresaId = infoStored.empresa

    Empresa.findById(empresaId, (err, client) => {

      if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
      if(!client) return res.status(404).send({message:'La empresa no existe'})
      client.infos.push(infoStored._id)
      client.save((err)=>{
        if(err)return res.status(500).send(err)

        res.status(200).send(infoStored)
      })
    })
  })
}

function updateInfo(req,res){

  let infoId = req.params.infoId
  let update = req.body
  if(req.body.position != undefined) info.position = JSON.parse(req.body.position)
  if(req.body.caracteristicas != undefined) info.carateristicas = JSON.parse(req.body.carateristicas)

  Info.findByIdAndUpdate(infoId, update,  (err, infoUpdated) =>{
    if(err) return res.status(500).send({message:`Error al editar la entrega de la base de datos ${err}`})
    if(infoUpdated == undefined) return res.status(404).send('No se encontró el info')

    Info.findById(infoUpdated._id).exec((err, infoNew)=>{
      if(err) return res.status(500).send(err)
      res.status(200).send(infoNew)

      // if((infoUpdated.state == 0 && infoNew.state == 1)||(infoUpdated.state == 0 && infoNew.state == 4)) {
      //   var JsonInfo = JSON.stringify(infoNew)
      //   firebase.SendNotificationDomiciliarios(config.state1,JsonInfo, "delete")
      // }
      // if((infoUpdated.state == 1 && infoNew.state == 0)||(infoUpdated.state == 2 && infoNew.state == 0)) {
      //   var JsonInfo = JSON.stringify(infoNew)
      //   firebase.SendNotificationDomiciliarios(config.state1,JsonInfo, "add")
      // }
      // if (infoUpdated.state == 1 && infoNew.state == 2){
      //   Domiciliario.findByIdAndUpdate(infoNew.domiciliario,{state: 3},(err, domiciliarioUpdated)=>{
      //     if(err)return res.status(500).send(err)
      //     res.status(200).send(infoNew)
      //   })
      // }else {
      //   res.status(200).send(infoNew)
      // }
    })
  })
}

function deleteInfo(req,res){
  let infoId = req.params.infoId
  Info.findById(infoId, (err, info) =>{
    if(err) return res.status(500).send({message:`Error al borrar la entrega de la base de datos ${err}`})

    info.remove(err =>{
        if(err)return res.status(500).send({message:`Error al borrar la entrega de la base de datos ${err}`})
        res.status(200).send({message:'La entrega ha sido borrada.'})
    })
  })
}

module.exports ={
  getInfo,
  getInfos,
  saveInfo,
  updateInfo,
  deleteInfo
}
