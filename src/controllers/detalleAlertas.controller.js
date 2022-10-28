import { json } from "express";
import { getConnection } from "../database/database";

const createNewDetalleAlerta = async(req, res)=>{
    try {
        const { usuario_id, alerta_id } = req.body; 
        if (usuario_id == undefined || alerta_id == undefined ) {
            return res.status(400).json({message: "Peticion erronea. Por favor debe definir todos los campos"})
        }
        
        const connection = await getConnection();         
        const fechaHora = new Date().toLocaleString("en-US", { timezone: "UTC" });
        const detalleAlerta = { usuario_id, alerta_id, fehca:fechaHora }
        const result = await connection.query("INSERT INTO detallealerta set ?", detalleAlerta);        
        detalleAlerta.id = result.insertId;
        res.json({ status: "OK", data: detalleAlerta});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

const deleteOneDetalleAlerta = async(req, res)=>{
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
        res.json({message: `alerta ${id} eliminada`});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

export const methods = {
    createNewDetalleAlerta,
    deleteOneDetalleAlerta
};
