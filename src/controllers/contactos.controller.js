import { json } from "express";
import { getConnection } from "../database/database";

const getAllContactos = async(req, res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM CONTACTO WHERE estado = 1");    
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

const getOneContacto = async(req, res)=>{
    try {        
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM CONTACTO where id = ? and estado = 1", id );
        if (result.length <= 0) {
            return res.status(404).json({message: "contacto no encontrado"});
        }
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

const createNewContacto = async(req, res)=>{
    try {
        const { nombre, celular } = req.body; 
        const { id, id2 } = req.params;
        console.log(id, id2);
        return json({ status: id, valor:id2 });
        if (nombre == undefined || celular == undefined) {
            return res.status(400).json({message: "Peticion erronea. Por favor debe definir todos los campos"})
        }
        
        const contacto = {
            nombre, celular
        }
        const connection = await getConnection();
        
        const existeCelular = await connection.query("SELECT COUNT(*) AS TOTAL FROM usuario where celular = ? and estado = 1", celular ); 
         
        if(existeCelular[0].TOTAL >= 1){
            return res.status(400).json({message: "Ya existe un usuario con el numero de celular introducido."})
        } 
        
        const result = await connection.query("INSERT INTO usuario set ?", usuario);
        const fechaHora = new Date().toLocaleString("en-US", { timezone: "UTC" });
        usuario.id = result.insertId; //agregar una nueva llave al objeto usuario
        res.json({ status: "OK", data: usuario});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

const updateOneContacto = async(req, res)=>{
    try {        
        const { id } = req.params;
        const { nombre, celular } = req.body;
        const connection = await getConnection();
        if (id==undefined || nombre == undefined || celular == undefined) {
            return res.status(400).json({message: "Peticion erronea. Por favor debe definir todos los campos"})
        }
        const contacto = {
            nombre, celular
        }

        const result = await connection.query("UPDATE CONTACTO SET nombre=?, telefono=?  WHERE id = ? and estado = 1", [nombre, celular, id]);         
        if (result.affectedRows <= 0) {
            return res.status(404).json({message: "contacto no encontrado"});
        }
        contacto.id = id; //agregar una nueva llave al objeto usuario
        res.json({ status: "OK", data: contacto});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

const deleteOneContacto = async(req, res)=>{
    try {        
        const { id } = req.params;
        const connection = await getConnection();
        if (id==undefined) {
            res.status(400).json({message: "Peticion erronea, debe definir el identificador a eliminar"})
        }
        const estado = { estado: 0 }
        const result = await connection.query("UPDATE CONTACTO SET ? WHERE id = ? and estado = 1", [estado, id]); 
        if (result.affectedRows <= 0) {
            return res.status(404).json({message: "contacto no encontrado"});
        }
        res.json({message: `contacto ${id} eliminado`});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

export const methods = {
    getAllContactos,
    getOneContacto,
    createNewContacto,
    updateOneContacto,
    deleteOneContacto
};
