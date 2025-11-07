import express from 'express';
import { getBestDestinations } from '../controllers/destinationController';

const router = express.Router();

// @route   GET /api/destinations/best
router.get('/best', getBestDestinations);

export default router;