require('dotenv').config({ path: './config/config.env' });
const express = require('express');
const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Conectado a la base de datos');
    app.listen(process.env.PORT, () => {
        console.log(`Servidor iniciado en el puerto: ${process.env.PORT} en modo: ${process.env.NODE_ENV}`);
      });
      
  }).catch((error) => {
    console.error('Error al conectar a la base de datos:', error.message);
  });
  
