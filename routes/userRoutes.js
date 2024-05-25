
import express from 'express';
import { registerUser, becomeMember, cancelMembership, getUserProfile, loginUser, getUserById, getAllUsers } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/become-member', protect, becomeMember);
router.put('/cancel-membership', protect, cancelMembership);
router.route('/:userId').get(getUserById);
router.get('/allusers', getAllUsers);


export default router;
