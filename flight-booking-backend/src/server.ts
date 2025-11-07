import express, { Express, Request, Response } from 'express';
import { connectDB, sequelize } from './config/database'; // <-- Import hàm connectDB của bạn
import config from './config/env'; // Import cấu hình port

// === IMPORT TẤT CẢ CÁC ROUTES CỦA BẠN ===
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import flightRoutes from './routes/flights';
import bookingRoutes from './routes/bookings';

// Khởi tạo ứng dụng Express
const app: Express = express();
const port = config.port || 5000;

// === CÀI ĐẶT MIDDLEWARE ===
// Middleware để parse JSON (rất quan trọng)
app.use(express.json());

// === ĐỊNH NGHĨA API ROUTES ===
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

// Route cơ bản để kiểm tra server
app.get('/', (req: Request, res: Response) => {
  res.send('Flight Booking API is running...');
});

/**
 * Hàm khởi động server
 * Sẽ kết nối database trước, sau đó mới lắng nghe request
 */
const startServer = async () => {
  try {
    // === ĐÂY LÀ LOGIC CỦA BẠN ===
    // Bạn đã có hàm connectDB (từ file database.ts)
    // làm việc này, nên chúng ta chỉ cần gọi nó.
    await connectDB();

    // Lắng nghe các request
    app.listen(port, () => {
      console.log(`⚡️ Server is running at http://localhost:${port}`);
    });
  } catch (err: any) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1); // Thoát nếu không kết nối được DB
  }
};

// === CHẠY SERVER ===
startServer();