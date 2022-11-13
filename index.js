require('dotenv').config();
const PORT = 3000;
const express = require('express');
const server = express();
const apiRouter = require('./api');
const morgan = require('morgan');

const { client } = require('./db');
client.connect();
server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
  });
;


server.use(morgan('dev'));

server.use(express.json())

server.use((req, res, next) => {
    console.log("-------Body Logger START--------");
    console.log(req.body);
    console.log("-------Body Logger END-----------");
  
    next();

});

server.use('/api', apiRouter);


