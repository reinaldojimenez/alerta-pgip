import express from "express";
import morgan from "morgan";
import usuariosRoutes from "./routes/usuarios.routes";
import contactosRoutes from "./routes/contactos.routes";
import alertasRoutes from "./routes/alertas.routes";
//import detalleAlertasRoutes from "./routes/detalleAlertas.routes";

const app = express();

//Setting
app.set('port', 4000);

//Middlewares
app.use(morgan('dev')); //usar morgan en modo de desarrollo(dev). 
//app.use(express.urlencoded({extended:false}));
app.use(express.json()); //para que el servidor pueda entender las peticiones en formato json

//Routes
app.use("/api/v1/usuarios", usuariosRoutes);
app.use("/api/v1/contactos", contactosRoutes)
app.use("/api/v1/alertas", alertasRoutes)
//app.use("/api/v1/detalleAlertas", detalleAlertasRoutes)

app.use(( req, res, next) =>{
    res.status(404).json({
        messge: "ruta no encontrada"
    })
});

export default app;