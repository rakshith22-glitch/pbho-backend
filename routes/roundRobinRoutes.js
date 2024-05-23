// backend/routes/roundRobinRoutes.js
import express from 'express';
import { getRoundRobins, createRoundRobin, updateRoundRobin, deleteRoundRobin, getRoundRobin } from '../controllers/roundRobinController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getRoundRobins).post(protect, createRoundRobin);
router.route('/:id').get(getRoundRobin).put(protect, updateRoundRobin).delete(protect, deleteRoundRobin);

export default router;
