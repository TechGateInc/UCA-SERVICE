require('dotenv').config()

const mainRoute = require('express').Router();


const api = require('./api/api.router');


mainRoute.use('/api', api);

module.exports=mainRoute
