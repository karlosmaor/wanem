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

  let info = new Info(req.body)
  if(req.body.ImagesPromo != undefined) update.ImagesPromo = JSON.parse(update.ImagesPromo)
  if(req.body.categorias != undefined) info.carateristicas = JSON.parse(req.body.categorias)
  info.date = new Date()

  info.save((err, infoStored)=>{
    if(err)return res.status(500).send({message :`Error al guardar la entrega en la base de datos: ${err}`})
    let empresaId = infoStored.empresa

    res.status(200).send({message:'Información guardada'})
  })
}

module.exports ={
  getInfos,
  saveInfo
}
