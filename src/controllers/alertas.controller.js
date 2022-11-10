import { json } from "express";
import { getConnection } from "../database/database";

const createNewAlerta = async(req, res)=>{
    try {
        const {usuario_id, latitud, longitud } = req.body; 
        if (usuario_id == undefined || latitud == undefined || longitud == undefined) {
            return res.status(400).json({message: "Peticion erronea. Por favor debe definir todos los campos"})
        }

        const connection = await getConnection(); 
        const usuario = await connection.query("SELECT * FROM USUARIO where id = ? and estado = 1", usuario_id );
        if (usuario.length <= 0) {
            return res.status(404).json({ message: "usuario no encontrado" });
        }
        
        const alerta = {latitud, longitud}        
        const newAlerta = await connection.query("INSERT INTO alerta set ?", alerta);

        const fecha = new Date();
        let fechaHora = `${fecha.getFullYear()}-${fecha.getMonth()+1}-${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
        const detalleAlerta = { usuario_id, alerta_id: newAlerta.insertId, fecha: fechaHora }
        const newDetalleAlerta = await connection.query("INSERT INTO detalle_alerta set ?", detalleAlerta);

        //NOTIFICAR A LOS RESPECTIVOS CONTACTOS
        const respuesta = {
            usuario_id, 
            alerta_id: newAlerta.insertId, 
            detalle_alerta_id: newDetalleAlerta.insertId,
            latitud, longitud, fecha: fechaHora
        }
        res.json({ status: "OK", data: respuesta});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

const deleteOneAlerta = async(req, res)=>{
    try {        
        const { id } = req.params;
        const connection = await getConnection();
        if (id==undefined) {
            res.status(400).json({message: "Peticion erronea, debe definir el identificador a eliminar"})
        }
        const estado = { estado: 0 }
        const result = await connection.query("UPDATE alerta SET ? WHERE id = ? and estado = 1", [estado, id]);
        if (result.affectedRows <= 0) {
            return res.status(404).json({message: "alerta no encontrada"});
        }

        const detalleAlerta = await connection.query("UPDATE detalle_alerta SET ? WHERE alerta_id = ? and estado = 1", [estado, id]);
        res.json({message: `alerta ${id} eliminada`});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

export const methods = {
    createNewAlerta,
    deleteOneAlerta
};

//72 2011