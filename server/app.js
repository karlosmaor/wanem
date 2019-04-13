'use strict'

const express = require('express')
var expressStatic = require('express-static')
const bodyParser = require('body-parser')
const app =  express()
const api = require('../routes')

app.use('/wanem', expressStatic('./webapp'))
app.use('/webapp/TemplateData', expressStatic('./webapp/TemplateData'))
app.use('/webapp/Build', expressStatic('./webapp/Build'))
app.use('/info', expressStatic('./public'))
app.use('/rex', expressStatic('./public/rex'))
app.use('/conopizza', expressStatic('./public/conopizza'))
app.use('/maxseguridad', expressStatic('./public/maxseguridad'))
app.use('/misterdog', expressStatic('./public/misterdog'))
app.use('/zummos', expressStatic('./public/zummos'))
app.use('/elnavio', expressStatic('./public/elnavio'))
app.use('/maloka', expressStatic('./public/maloka'))
app.use('/bocagrande', expressStatic('./public/bocagrande'))
app.use('/qbanitos', expressStatic('./public/qbanitos'))
app.use('/laruta', expressStatic('./public/laruta'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/api',function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Accept, X-Access-Token, X-Application-Name, X-Request-Sent-Time');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
}, api)

module.exports = app
