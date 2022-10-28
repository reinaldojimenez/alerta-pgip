import {Router} from "express";
import { methods as detalleAlertas } from "../controllers/detalleAlertas.controller";

const router = Router();

router.post("/", (detalleAlertas.createNewDetalleAlerta));
router.delete("/:id", (detalleAlertas.deleteOneDetalleAlerta));

//module.exports = router;
export default router;