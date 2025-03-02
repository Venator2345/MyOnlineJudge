import express from "express";
import AuthControl from "../controls/AuthControl.js";

const router = express.Router();
const authControl = new AuthControl();

router.post("/login", authControl.login);

export default router;