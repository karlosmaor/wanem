'use strict'

const mongoose = require('mongoose')
const Info =  require('../models/info')
const Empresa =  require('../models/empresa')
const Evento =  require('../models/evento')
const config = require('../config')

function getInformacion(req, res){
  Info.find({}).limit(1).sort('-date').populate('categorias.empresas').populate('eventos').exec((err, infos)=>{

    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(infos.length == 0)return res.status(501).send({message:'No hay información registrada'})

    Empresa.find({},'ImagesPromo').exec((err, empresas)=>{
      if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})

      empresas.forEach(function(element){
        element.ImagesPromo.forEach(function(ImPro){
          infos[0].ImagesPromo.push(ImPro)
        })
      })

      Evento.find({date: {'$gte': new Date()}}, 'ImagesPromo', (err, eventos)=>{
        if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})

        eventos.forEach(function(element){
          infos[0].ImagesPromo.push(element.ImagesPromo)
        })
        const categor = infos[0].categorias.filter(x => x.visible == true)
        infos[0].categorias = categor;
        res.status(200).send(infos[0])
      })
    })
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

  Empresa.find({visible: true},'category').sort('orden').exec((err, empresas)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})

    info.categorias.forEach(function(cat){
      cat.empresas = new Array(0)
    })

    empresas.forEach(function(empre){
      if(empre.category != undefined && info.categorias.find(x => x.name == empre.category) != undefined){
        info.categorias.find(x => x.name == empre.category).empresas.push(empre._id)
      }
    })

    Evento.find({}, '_id', (err, eventos)=>{
      if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
      info.eventos = eventos

      info.save((err, infoStored)=>{
        if(err)return res.status(500).send({message :`Error al guardar la información en la base de datos: ${err}`})

        res.status(200).send({message:'Información guardada'})
      })
    })
  })
}

module.exports ={
  getInformacion,
  getInfos,
  saveInfo
}
