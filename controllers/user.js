'use strict'

const mongoose = require('mongoose')
const User = require('../models/user')
const service = require('../services')

function getUser(req,res){
  let userId = req.params.userId

  User.findById(userId, (err, user) => {

    if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(!user) return res.status(404).send({message:'El User no existe'})

    res.status(200).send(user)
  })
}

function getUsers(req, res){
  User.find({}, (err, users)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(users.length == 0)return res.status(501).send({message:'No hay Users registrados'})

    res.status(200).send(users)
  })
}

function updateUser(req,res){
  let userId = req.params.userId
  let update = req.body

  if(update.position != undefined) update.position = JSON.parse(update.position)

  User.findByIdAndUpdate(userId, update, (err, userUpdated) =>{
    if(err) return res.status(500).send({message:`Error al editar el User en la base de datos ${err}`})

    if(update.password != undefined){

      User.findById(userId, (err, user)=>{
        if(err) return res.status(500).send(err)
        user.password = update.password
        user.save((err)=>{
          if(err)return res.status(500).send(err)

        })
      })
    }
    res.status(200).send(userUpdated)
  })
}

function deleteUser(req,res){
  let userId = req.params.userId
  User.findById(userId, (err, user) =>{
    if(err) return res.status(500).send({message:`Error al eliminar al User de la base de datos ${err}`})

    user.remove(err =>{
        if(err)return res.status(500).send({message:`Error al borrar el User de la base de datos ${err}`})
        res.status(200).send({message:'El User ha sido borrado.'})
    })
  })
}

function saveUser(req,res){

  let userJson = JSON.parse(req.body.userJson)
  userJson.lastLogin = new Date()

  let user = new User(userJson)

  User.findOne({email: user.email}).populate('pedidos').exec((err,clien) =>{
    if(err) return res.status(500).send({message: err})

    if(!clien) {
      user.signupDate = new Date()
      user.save((err,userStored)=>{
        if(err) return res.status(500).send({message: `Error registrando nuevo User: ${err}`})

        res.status(201).send(userStored)
      })
    }else {
      clien.lastLogin = new Date()
      clien.save((err,userStored)=>{
        if(err) return res.status(500).send({message: `Error registrando nuevo User: ${err}`})

        res.status(201).send(clien)
      })
    }
  })
}


function getCreate(req,res){
  User.findOne({email: req.body.email}, (err, user)=>{
    if(err) return res.status(500).send({message: err})
    if(!user){
      const usere = new User()
      usere.email = req.body.email
      usere.password = req.body.password
      usere.name = req.body.name
      usere.phone = req.body.phone
      usere.save((err)=>{
        if(err) return res.status(500).send({message: `Error registrando nuevo usere: ${err}`})
        res.status(200).send(usere)
      })
    }else{
      res.status(200).send(user)
    }
  })
}

module.exports = {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  saveUser,
  getCreate
}
