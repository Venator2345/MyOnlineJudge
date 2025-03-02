import express from 'express';
import AttempControl from '../controls/AttemptControl.js';

const attempControl = new AttempControl();
const router = express.Router();

router.post('/', attempControl.createAttempt);

export default router;