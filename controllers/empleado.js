'use strict'

const mongoose = require('mongoose')
const Empleado = require('../models/empleado')
const Empresa = require('../models/empresa')
const service = require('../services')

function getEmpleado(req,res){
  let empleadoId = req.params.empleadoId

  Empleado.findById(empleadoId, (err, empleado) => {

    if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(!empleado) return res.status(404).send({message:'El Empleado no existe'})

    res.status(200).send(empleado)
  })
}

function getEmpleados(req, res){
  Empleado.find({empresa:req.params.empresaId}, (err, empleados)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(empleados.length == 0)return res.status(501).send({message:'No hay Empleados registrados'})

    res.status(200).send(empleados)
  })
}

function updateEmpleado(req,res){
  let empleadoId = req.params.empleadoId
  let update = req.body

  Empleado.findByIdAndUpdate(empleadoId, update, (err, empleadoUpdated) =>{
    if(err) return res.status(500).send({message:`Error al editar el Empleado en la base de datos ${err}`})

    res.status(200).send(empleadoUpdated)
  })
}

function deleteEmpleado(req,res){
  let empleadoId = req.params.empleadoId
  Empleado.findById(empleadoId, (err, empleado) =>{
    if(err) return res.status(500).send({message:`Error al eliminar al Empleado de la base de datos ${err}`})

    empleado.remove(err =>{
        if(err)return res.status(500).send({message:`Error al borrar el Empleado de la base de datos ${err}`})
        res.status(200).send({message:'El Empleado ha sido borrado.'})
    })
  })
}

function saveEmpleado(req,res){

  let empleadoJson = JSON.parse(req.body.empleadoJson)

  let empleado = new Empleado(empleadoJson)

  Empleado.findOne({email: empleado.email},(err,clien) =>{
    if(err) return res.status(500).send({message: err})

    if(!clien){
      empleado.save((err,empleadoStored)=>{
        if(err) return res.status(500).send({message: `Error registrando nuevo Empleado: ${err}`})

        res.status(201).send(empleadoStored)
      })
    }else {
      clien.empresa = empleadoJson.empresa
      clien.save((err,clienStored)=>{
        if(err) return res.status(500).send({message: `Error registrando nuevo Empleado: ${err}`})

        res.status(201).send(clien)
      })
    }
  })
}

function signIn(req,res){
  let usuario = req.body.email
  let contra = req.body.contra

  Empleado.findOne({email: usuario}, (err,emple) => {
    if(err) return res.status(500).send({message: err})
    if(!emple) return res.status(501).send('El empleado no está registrado')

    Empresa.findById(emple.empresa, (err, empresa) => {

      if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
      if(!empresa) return res.status(404).send({message:'El Empresa no existe'})

      if(empresa.claveDinamica == contra || empresa.claveCajero == contra){
        emple.ingresoDate.push(new Date())
        emple.save((err)=>{
          if(err)return res.status(500).send(err)

          if(emple.tipo == "Cajero" && empresa.claveCajero == contra){
            empresa.claveDinamica = (Math.floor(Math.random()*9000)+1000).toString()
            empresa.save((err)=>{
              if(err)return res.status(500).send(err)
            })
          }

          res.status(200).send({
            empleado:emple,
            empresa:empresa
          })
        })
      }else{
          res.status(300).send('Contraseña erronea')
      }
    })
  })
}

module.exports = {
  getEmpleado,
  getEmpleados,
  deleteEmpleado,
  updateEmpleado,
  saveEmpleado,
  signIn
}
