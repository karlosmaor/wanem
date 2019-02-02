'use strict'

const express = require('express')
const api = express.Router()
//const auth = require('../middlewares/auth')

const UserCtrl = require('../controllers/user')
const EmpleadoCtrl = require('../controllers/empleado')
const PedidoCtrl  = require('../controllers/pedido')
const ComandaCtrl  = require('../controllers/comanda')
const EmpresaCtrl  = require('../controllers/empresa')
const EventoCtrl = require('../controllers/evento')
const InfoCtrl = require('../controllers/info')

//----------------Rutas Users-------------//

api.get('/users', UserCtrl.getUsers)
api.get('/user/:userId', UserCtrl.getUser)
api.post('/user', UserCtrl.saveUser)
api.post('/user/get/create', UserCtrl.getCreate)
api.post('/user/:userId', UserCtrl.updateUser)
api.put('/user/:userId', UserCtrl.updateUser)
api.delete('/user/:userId', UserCtrl.deleteUser)

//----------------Rutas Empleados-------------//

api.get('/empleados', EmpleadoCtrl.getEmpleados)
api.get('/empleado/:empleadoId', EmpleadoCtrl.getEmpleado)
api.post('/empleado', EmpleadoCtrl.saveEmpleado)
api.post('/empleado/signin', EmpleadoCtrl.signIn)
api.post('/empleado/:empleadoId', EmpleadoCtrl.updateEmpleado)
api.put('/empleado/:empleadoId', EmpleadoCtrl.updateEmpleado)
api.delete('/empleado/:empleadoId', EmpleadoCtrl.deleteEmpleado)

//---------------Rutas para pedidos----------//

api.get('/pedidos', PedidoCtrl.getPedidos)
api.get('/pedidos/empresa', PedidoCtrl.getPedidosEmpresas)
api.get('/pedido/:pedidoId', PedidoCtrl.getPedido)
api.post('/pedido', PedidoCtrl.savePedido)
api.post('/pedido/buscar/fecha', PedidoCtrl.search)
api.post('/pedido/search/state', PedidoCtrl.searchState)
api.post('/pedido/:pedidoId', PedidoCtrl.updatePedido)
api.put('/pedido/:pedidoId', PedidoCtrl.updatePedido)
api.delete('/pedido/:pedidoId', PedidoCtrl.deletePedido)

//---------------Rutas para comandas----------//

api.get('/comandas', ComandaCtrl.getComandas)
api.get('/comanda/:comandaId', ComandaCtrl.getComanda)
api.post('/comandas/dia', ComandaCtrl.getComandasDia)
api.post('/comandas/actuales', ComandaCtrl.getComandasActuales)
api.post('/comanda', ComandaCtrl.saveComanda)
api.post('/comanda/buscar/fecha', ComandaCtrl.search)
api.post('/comanda/search/state', ComandaCtrl.searchState)
api.post('/comanda/:comandaId', ComandaCtrl.updateComanda)
api.put('/comanda/:comandaId', ComandaCtrl.updateComanda)
api.delete('/comanda/:comandaId', ComandaCtrl.deleteComanda)

//--------------Rutas para empresa-------------//

api.get('/empresas', EmpresaCtrl.getEmpresas)
api.get('/empresa/:empresaId', EmpresaCtrl.getEmpresa)
api.post('/empresa/signup', EmpresaCtrl.signUp)
api.post('/empresa/signin', EmpresaCtrl.signIn)
api.post('/empresa/search', EmpresaCtrl.search)
api.post('/empresa/:empresaId', EmpresaCtrl.updateEmpresa)
api.put('/empresa/:empresaId', EmpresaCtrl.updateEmpresa)
api.delete('/empresa/:empresaId', EmpresaCtrl.deleteEmpresa)

//---------------Rutas para eventos----------//

api.get('/eventos', EventoCtrl.getEventos)
api.get('/evento/:eventoId', EventoCtrl.getEvento)
api.post('/evento', EventoCtrl.saveEvento)
api.post('/evento/:eventoId', EventoCtrl.updateEvento)
api.put('/evento/:eventoId', EventoCtrl.updateEvento)
api.delete('/evento/:eventoId', EventoCtrl.deleteEvento)

//---------------Rutas para info----------//

api.get('/infos', InfoCtrl.getInfos)
api.get('/informacion', InfoCtrl.getInformacion)
api.post('/info', InfoCtrl.saveInfo)

/*api.get('/private', auth, function(req,res){
  res.status(200).send({message:'Tienes acceso'})
})*/

module.exports = api
