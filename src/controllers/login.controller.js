import { getConnection } from "../database/database";


const AutenticarUsuario = async(req, res)=>{
    try {        
        const { celular, password } = req.body;
        const connection = await getConnection();
        if ( celular==undefined || password == undefined ) {
            return res.status(400).json({message: "Peticion erronea. Por favor debe definir todos los campos"})
        }

        //const result = await connection.query("UPDATE USUARIO SET nombre=?, apellido_paterno=?, apellido_materno=?, foto=? WHERE id = ? and estado = 1", [nombre, apellido_paterno, apellido_materno, foto, id]);         
        const result = await connection.query("SELECT * FROM USUARIO where celular = ? and password = ? and estado = 1", [celular, password]);
        if (result.length <= 0) {
            return res.status(404).json({message: "usuario o contraseña incorrecta"});
        }
        const user = await connection.query("SELECT id, nombre, apellido_paterno, apellido_materno, celular, foto FROM USUARIO where celular = ? and password = ? and estado = 1", [celular, password]);
        
        //usuario.id = id; //agregar una nueva llave al objeto usuario
        res.json({ status: "OK", data: user[0] });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}


export const methods = {
    AutenticarUsuario
};

//SELECT IFNULL("nulli", 500);
//SELECT IFNULL(null, 500);