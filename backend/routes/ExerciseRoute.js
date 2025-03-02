import express from "express";
import ExerciseControl from "../controls/ExerciseControl.js";

const router = express.Router();
const exerciseControl = new ExerciseControl();

router.get('/',exerciseControl.getExercises);
router.get('/:id',exerciseControl.getExerciseById);

export default router;