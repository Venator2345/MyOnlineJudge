import express from "express";
import UserControl from "../controls/UserControl.js";

const router = express.Router();
const userControl = new UserControl();

router.get('/', userControl.getUsers);
router.get('/:name', userControl.getUserByName);
router.post('/', userControl.createUser);

export default router;