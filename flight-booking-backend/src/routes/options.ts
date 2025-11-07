import express from 'express';
import { getBaggageOptions } from '../controllers/optionsController';

const router = express.Router();

// @route   GET /api/options/baggage
// API này sẽ đọc "Menu" hành lý
router.get('/baggage', getBaggageOptions);

export default router;