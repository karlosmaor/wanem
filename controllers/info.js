'use strict'

const mongoose = require('mongoose')
const Info =  require('../models/info')
const Empresa =  require('../models/empresa')
const config = require('../config')

function getInformacion(req, res){
  Info.find({}).limit(1).sort('-date').exec((err, infos)=>{

    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(infos.length == 0)return res.status(501).send({message:'No hay información registrada'})
    let informacion = infos[0]

    for(i=0; i<informacion.categorias.length; i++){
      Empresa.find({category: informacion.categorias[i].name}, (err, empresasLista)=>{
        if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})

        informacion.categorias[i].empresas = empresasLista
      })
    }
    res.status(200).send(informacion)
  })
}

function getInfos(req, res){
  Info.find({}).limit(1).sort('-date').exec((err, infos)=>{

    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(infos.length == 0)return res.status(501).send({message:'No hay información registrada'})

    res.status(200).send(infos[0])
  })
}

function saveInfo(req,res){
  let infoJson = JSON.parse(req.body.infoJson)
  delete infoJson._id
  infoJson.date = new Date()

  let info = new Info(infoJson)

  info.save((err, infoStored)=>{
    if(err)return res.status(500).send({message :`Error al guardar la entrega en la base de datos: ${err}`})

    res.status(200).send({message:'Información guardada'})
  })
}

module.exports ={
  getInfos,
  getInformacion,
  saveInfo
}
