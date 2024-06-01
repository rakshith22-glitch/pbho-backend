// backend/routes/roundRobinRoutes.js
import express from 'express';
import { getRoundRobins, createRoundRobin, updateRoundRobin,
     deleteRoundRobin, addUserToRoundRobin, removeUserFromRoundRobin,
        getRoundRobin ,joinRoundRobin, joinWaitlist, addJoinRequest,
        approveJoinRequest, updateScores} 
        from '../controllers/roundRobinController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getRoundRobins).post(protect, createRoundRobin);
router.route('/:id').get(getRoundRobin).put(protect, updateRoundRobin).delete(protect, deleteRoundRobin);

// Joining and waitlisting routes
router.route('/:id/join')
    .post(protect, joinRoundRobin); // Join a specific round robin

router.route('/:id/waitlist')
    .post(protect, joinWaitlist); // Join the waitlist for a specific round robin

router.post('/:id/add-user', protect, addUserToRoundRobin);
router.post('/:id/remove-user', protect, removeUserFromRoundRobin);

router.post('/:id/join-request', addJoinRequest);
router.post('/:id/approve-request', approveJoinRequest);

router.post('/:id/scores', updateScores);

export default router;
