// src/routes/airportRoutes.ts
import express from "express";
import { getAllAirports } from "../controllers/airportController";

const router = express.Router();

router.get("/", getAllAirports);

export default router;
