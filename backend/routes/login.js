import express from "express";
import LoginController from "../controllers/LoginController.js";

const router = express.Router();

router.post("/", LoginController.login);

router.post("/register", LoginController.register);

router.post("/logout", LoginController.logout);

router.get("/verificarToken", LoginController.verificarToken);

router.get('/auth/me', LoginController.getCurrentUser);



export default router;