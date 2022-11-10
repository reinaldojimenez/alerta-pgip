import {Router} from "express";
import { methods as loginController } from "../controllers/login.controller";

const router = Router();

router.post("/", (loginController.AutenticarUsuario));

//module.exports = router;
export default router;