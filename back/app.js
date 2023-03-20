const express=require("express");
const app=express();

//la aplicacion usa herramientas de express respecto a json
app.use(express.json());

// importar rutas
const tryHello=require("./routes/try")

//Ruta del navegador por defecto
app.use(tryHello)

module.exports=app