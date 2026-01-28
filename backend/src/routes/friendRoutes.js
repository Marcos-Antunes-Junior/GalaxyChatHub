import express from 'express';
import { getFriends, getFriendRequests, sendFriendRequest, acceptFriendRequest } from '../controllers/friendController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(isAuthenticated);

router.get('/', getFriends);
router.get('/requests', getFriendRequests);
router.post('/request', sendFriendRequest);
router.post('/accept', acceptFriendRequest);

export default router;
