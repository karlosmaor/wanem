'use strict'

const mongoose = require('mongoose')
const Empresa = require('../models/empresa')
const service = require('../services')

function getEmpresa(req,res){
  let empresaId = req.params.empresaId

  Empresa.findById(empresaId, (err, empresa) => {

    if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(!empresa) return res.status(404).send({message:'El Empresa no existe'})

    res.status(200).send(empresa)
  })
}

function getEmpresas(req, res){
  Empresa.find({}).populate('eventos').exec((err, empresas)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(empresas.length == 0)return res.status(501).send({message:'No hay Empresas registrados'})

    res.status(200).send(empresas)
  })
}

function updateEmpresa(req,res){
  let empresaJson = JSON.parse(req.body.empresaJson)
  delete empresaJson.eventos
  if(empresaJson.password.length == 0){
    delete empresaJson.password
  }
  let empresaId = req.params.empresaId

  Empresa.findByIdAndUpdate(empresaId, empresaJson, (err, empresaUpdated) =>{
    if(err) return res.status(500).send({message:`Error al editar la Empresa en la base de datos ${err}`})

    if(empresaJson.password != undefined){

      Empresa.findById(empresaId, (err, empresa)=>{
        if(err) return res.status(500).send(err)
        empresa.password = empresaJson.password
        empresa.save((err)=>{
          if(err)return res.status(500).send(err)

        })
      })
    }
    res.status(200).send("Actualización exitosa.")
  })
}

function deleteEmpresa(req,res){
  let empresaId = req.params.empresaId
  Empresa.findById(empresaId, (err, empresa) =>{
    if(err) return res.status(500).send({message:`Error al eliminar al Empresa de la base de datos ${err}`})

    empresa.remove(err =>{
        if(err)return res.status(500).send({message:`Error al borrar el Empresa de la base de datos ${err}`})
        res.status(200).send({message:'El Empresa ha sido borrado.'})
    })
  })
}

function signUp(req,res){
  const empresa = new Empresa(req.body)
  empresa.signupDate = new Date()
  empresa.lastLogin = new Date()

  Empresa.find({email: req.body.email}, (err,clien) =>{
    if(err) return res.status(500).send({message: err})

    if(clien.length != 0) return res.status(501).send({message: 'EL correo ya existe en nuestra base de datos'})

    empresa.save((err)=>{
      if(err) return res.status(500).send({message: `Error registrando nuevo Empresa: ${err}`})

      res.status(201).send(empresa)
    })
  })
}

function signIn(req,res){

  Empresa.findOne({email: req.body.email}, (err, empresa)=>{
    if(err) return res.status(500).send({error: err})
    if(!empresa) return res.status(404).send({  message: 'No existe el usuario'})

    empresa.comparePass(req.body.password,(isMatch)=>{
      if(isMatch){
        var update = {lastLogin:new Date()}
        Empresa.findByIdAndUpdate(empresa._id, update, (err, empresaUpdated) =>{
          if(err) return res.status(205).send({message:`Error al editar el Empresa en la base de datos ${err}`})

          res.status(200).send(empresa)
        })
      }else {
        res.status(406).send({error: 'Contraseña incorrecta.'})
      }
    })
  })
}

function search(req, res){
  Empresa.find(req.body, (err, empresas)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(empresas.length == 0)return res.status(501).send({message:'No hay empresaes registrados'})

    res.status(200).send( empresas )
  })
}


module.exports = {
  getEmpresa,
  getEmpresas,
  deleteEmpresa,
  updateEmpresa,
  signUp,
  signIn,
  search
}
