import express from 'express';
import AttempControl from '../controls/AttemptControl.js';

const attempControl = new AttempControl();
const router = express.Router();

router.get('/:userId', attempControl.getAttemptsByUser);
router.post('/', attempControl.createAttempt);

export default router;