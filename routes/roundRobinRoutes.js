// backend/routes/roundRobinRoutes.js
import express from 'express';
import { getRoundRobins, createRoundRobin, updateRoundRobin, deleteRoundRobin, getRoundRobin ,joinRoundRobin, joinWaitlist} from '../controllers/roundRobinController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getRoundRobins).post(protect, createRoundRobin);
router.route('/:id').get(getRoundRobin).put(protect, updateRoundRobin).delete(protect, deleteRoundRobin);

// Joining and waitlisting routes
router.route('/:id/join')
    .post(protect, joinRoundRobin); // Join a specific round robin

router.route('/:id/waitlist')
    .post(protect, joinWaitlist); // Join the waitlist for a specific round robin

// Route to get all round robins a user is part of
// router.route('/user-roundrobins/:userId')
//     .get(protect, getUserRoundRobins); // Get all round robins associated with a user


export default router;
