import { getConnection } from "../database/database";

const getAllUsuarios = async(req, res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM USUARIO WHERE estado = 1");    
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

const getOneUsuario = async(req, res)=>{
    try {        
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM USUARIO where id = ? and estado = 1", id );
        if (result.length <= 0) {
            return res.status(404).json({message: "usuario no encontrado"});
        }
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

const createNewUsuario = async(req, res)=>{
    try {
        const { nombre, apellido_paterno, apellido_materno, celular, foto } = req.body;
        /*const persona ={
            nombre: req.body.nombre,
            apellido_paterno: req.body.apellido_paterno, 
            apellido_materno: req.body.apellido_materno, 
            celular: req.body.celular, 
            foto: req.body.foto
        }*/
               
        if (nombre == undefined || apellido_paterno == undefined || apellido_materno == undefined || celular == undefined) {
            return res.status(400).json({message: "Peticion erronea. Por favor debe definir todos los campos"})
        }
        
        const usuario = {
            nombre, apellido_paterno, apellido_materno, celular, foto
        }
        const connection = await getConnection();
        //const existeCelular = await connection.query("SELECT COUNT(*) AS TOTAL FROM usuario where celular = ? and estado = 1 limit 1", celular );  
        const existeCelular = await connection.query("SELECT COUNT(*) AS TOTAL FROM usuario where celular = ? and estado = 1", celular ); 
         
        if(existeCelular[0].TOTAL >= 1){
            return res.status(400).json({message: "Ya existe un usuario con el numero de celular introducido."})
        } 
        
        const result = await connection.query("INSERT INTO usuario set ?", usuario);
        const fechaHora = new Date().toLocaleString("en-US", { timezone: "UTC" });
        usuario.id = result.insertId; //agregar una nueva llave al objeto usuario
        res.json({ status: "OK", data: usuario });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

const updateOneUsuario = async(req, res)=>{
    try {        
        const { id } = req.params;
        const { nombre, apellido_paterno, apellido_materno, foto } = req.body;
        const connection = await getConnection();
        if (id==undefined || nombre == undefined || apellido_paterno == undefined || apellido_materno == undefined) {
            return res.status(400).json({message: "Peticion erronea. Por favor debe definir todos los campos"})
        }
        const usuario = {
            nombre, apellido_paterno, apellido_materno, foto
        }
        //const result = await connection.query("UPDATE USUARIO SET ? WHERE id = ? and estado = 1", [usuario, id]); 
        /*****************NO PUEDE ACTUALIZAR EL NUMERO DE CELULAR*****************/
        const result = await connection.query("UPDATE USUARIO SET nombre=?, apellido_paterno=?, apellido_materno=?, foto=? WHERE id = ? and estado = 1", [nombre, apellido_paterno, apellido_materno, foto, id]);         
        if (result.affectedRows <= 0) {
            return res.status(404).json({message: "usuario no encontrado"});
        }
        usuario.id = id; //agregar una nueva llave al objeto usuario
        res.json({ status: "OK", data: usuario });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

const deleteOneUsuario = async(req, res)=>{
    try {        
        const { id } = req.params;
        const connection = await getConnection();
        if (id==undefined) {
            res.status(400).json({message: "Peticion erronea, debe definir el identificador a eliminar"})
        }
        const estado = {estado: 0}
        //const result = await connection.query("DELETE FROM USUARIO where id = ?", id); 
        const result = await connection.query("UPDATE USUARIO SET ? WHERE id = ? and estado = 1", [estado, id]); 
        if (result.affectedRows <= 0) {
            return res.status(404).json({message: "usuario no encontrado"});
        }
        res.json({message: `usuario ${id} eliminado`});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

const getUsuarioContacto = async(req, res)=>{
    try {        
        const { id } = req.params;
        const connection = await getConnection();
        if (id==undefined) {
            res.status(400).json({ message: "Peticion erronea, debe definir el identificador del usuario" })
        }
        
        const usuario = await connection.query("SELECT * FROM USUARIO where id = ? and estado = 1", id );
        if (usuario.length <= 0) {
            return res.status(404).json({ message: "usuario no encontrado" });
        }
        const usuarioConContacto = await connection.query("SELECT CONTACTO.id, CONTACTO.nombre, CONTACTO.celular, CONTACTO.usuario_id FROM USUARIO, CONTACTO WHERE USUARIO.ID=CONTACTO.USUARIO_ID AND USUARIO_ID=? AND USUARIO.ESTADO = 1 AND CONTACTO.ESTADO = 1", [id]);
        return res.json({ status: "OK", data: usuarioConContacto });        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const createOneUsuarioContacto = async(req, res)=>{
    try {        
        const { id } = req.params;
        const { nombre, celular } = req.body;
        const connection = await getConnection();
        if (id==undefined || nombre==undefined || celular==undefined) {
            res.status(400).json({ message: "Peticion erronea, Por favor debe definir todos los campos" })
        }
        
        const usuario = await connection.query("SELECT * FROM USUARIO where id = ? and estado = 1", id );
        if (usuario.length <= 0) {
            return res.status(404).json({ message: "usuario no encontrado" });
        }
        const cantidadUsuarioConContacto = await connection.query("SELECT COUNT(*) as CANTIDAD FROM USUARIO, CONTACTO WHERE USUARIO.ID=CONTACTO.USUARIO_ID AND USUARIO_ID=? AND USUARIO.ESTADO = 1 AND CONTACTO.ESTADO = 1", [id]);
        if (cantidadUsuarioConContacto[0].CANTIDAD == 3) {
            return res.status(404).json({ message: "Contactos llenos, solo puede agregar 3 Contactos" });
        }

        const usuario_id = id; //cree la variable usuario_id porque la base de datos mapea el nombre de las variables que coinciden con los atributos de la tabla.
        const contacto = {nombre, celular, usuario_id};
        const nuevoContacto = await connection.query("INSERT INTO contacto set ?", contacto);
        contacto.id = nuevoContacto.insertId
        return res.json({ status: "OK", data: contacto });   
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const updateOneUsuarioContacto = async(req, res)=>{
    try {        
        const { id, contacto_id } = req.params;
        const { nombre, celular} = req.body;
        const connection = await getConnection();
        if ( id==undefined || contacto_id==undefined || nombre == undefined || celular == undefined ) {
            return res.status(400).json({message: "Peticion erronea. Por favor debe definir todos los campos"})
        }
        const usuario = await connection.query("SELECT * FROM USUARIO where id = ? and estado = 1", id );
        if (usuario.length <= 0) {
            return res.status(404).json({ message: "usuario no encontrado" });
        }

        const contacto = await connection.query("SELECT * FROM CONTACTO where id = ? and estado = 1", contacto_id );
        if (contacto.length <= 0) {
            return res.status(404).json({ message: "Contacto no encontrado" });
        }

        const result = await connection.query("UPDATE contacto SET nombre=?, celular=? WHERE usuario_id=? and id = ? and estado = 1", [nombre, celular, id, contacto_id]); 
        if (result.affectedRows <= 0) {
            return res.status(404).json({message: "No fue encontrado el usuario con el contacto solicitado"});
        }
        const miContacto = {contacto_id, nombre, celular};
        res.json({ status: "OK", data: miContacto });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }    
}

const deleteOneUsuarioContacto = async(req, res)=>{
    try {        
        const { id, contacto_id } = req.params;
        const connection = await getConnection();
        if ( id==undefined || contacto_id==undefined ) {
            res.status(400).json({message: "Peticion erronea, debe definir el identificador a eliminar"})
        }

        const usuario = await connection.query("SELECT * FROM USUARIO where id = ? and estado = 1", id );
        if (usuario.length <= 0) {
            return res.status(404).json({ message: "usuario no encontrado" });
        }

        const contacto = await connection.query("SELECT * FROM CONTACTO where id = ? and estado = 1", contacto_id );
        if (contacto.length <= 0) {
            return res.status(404).json({ message: "Contacto no encontrado" });
        }

        const estado = {estado: 0}
        //const result = await connection.query("UPDATE CONTACTO, USUARIO SET CONTACTO.ESTADO = ? WHERE USUARIO.ID=CONTACTO.USUARIO_ID AND CONTACTO.USUARIO_ID = ? AND CONTACTO.ID = ? and CONTACTO.estado=1 AND USUARIO.ESTADO = 1", [estado, id, contacto_id]);         
        const result = await connection.query("UPDATE CONTACTO set ESTADO = ? WHERE USUARIO_ID = ? AND ID = ? and estado=1", [estado, id, contacto_id]);         
        if (result.affectedRows <= 0) {
            return res.status(404).json({message: "No fue encontrado el usuario con el contacto solicitado"});
        }
        res.json({message: `contacto ${contacto_id} eliminado`});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

export const methods = {
    getAllUsuarios,
    getOneUsuario,
    createNewUsuario,
    updateOneUsuario,
    deleteOneUsuario,
    getUsuarioContacto,
    createOneUsuarioContacto,
    updateOneUsuarioContacto,
    deleteOneUsuarioContacto
};

//SELECT IFNULL("nulli", 500);
//SELECT IFNULL(null, 500);