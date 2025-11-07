// src/server.ts
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import flightRoutes from './routes/flightsRoutes';
import airportRoutes from "./routes/airportRoutes";
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Kết nối DB
connectDB();

// API
app.use('/api/flights', flightRoutes);
app.use("/api/airports", airportRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
export default app;