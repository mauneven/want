const express=require("express");
const app=express();

//la aplicacion usa herramientas de express respecto a json
app.use(express.json());

// importar rutas
const tryHello=require("./routes/try")
const auth=require('./routes/authRoutes')
const post=require('./routes/postRoutes')


//Ruta del navegador por defecto
app.use(tryHello)
app.use(auth)
app.use(post)

module.exports=app