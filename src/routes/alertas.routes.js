import {Router} from "express";
import { methods as alertasController } from "../controllers/alertas.controller";

const router = Router();

router.post("/", (alertasController.createNewAlerta));
router.delete("/:id", (alertasController.deleteOneAlerta));

//module.exports = router;
export default router;