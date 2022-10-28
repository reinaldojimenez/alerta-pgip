import {Router} from "express";
import { methods as contactosController } from "../controllers/contactos.controller";

const router = Router();

router.get("/", (contactosController.getAllContactos));
router.get("/:id", (contactosController.getOneContacto));
router.post("/", (contactosController.createNewContacto));
router.put("/:id", (contactosController.updateOneContacto));
router.delete("/:id", (contactosController.deleteOneContacto));

//module.exports = router;
export default router;