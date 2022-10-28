import {Router} from "express";
import { methods as usuariosController } from "../controllers/usuarios.controller";

const router = Router();

router.get("/", (usuariosController.getAllUsuarios));
router.get("/:id", (usuariosController.getOneUsuario));
router.get("/:id/contactos", (usuariosController.getUsuarioContacto));
router.post("/:id/contactos", (usuariosController.createOneUsuarioContacto));
router.put("/:id/contactos/:contacto_id", (usuariosController.updateOneUsuarioContacto));
router.delete("/:id/contactos/:contacto_id", (usuariosController.deleteOneUsuarioContacto));
router.post("/", (usuariosController.createNewUsuario));
router.put("/:id", (usuariosController.updateOneUsuario));
router.delete("/:id", (usuariosController.deleteOneUsuario));

//module.exports = router;
export default router;