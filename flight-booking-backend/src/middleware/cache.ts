import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';

const DEFAULT_EXPIRATION = 600; // 10 phút

export const cacheMiddleware = (keyPrefix: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // === FAIL-SAFE: Nếu Redis chưa kết nối, bỏ qua cache và chạy tiếp ===
    if (!redisClient.isOpen) {
        // console.warn('⚠️ Redis client is closed. Skipping cache.');
        return next();
    }

    const key = `${keyPrefix}:${req.originalUrl}`;
    
    // Bắt đầu bấm giờ
    const start = process.hrtime(); 

    try {
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        // Tính thời gian kết thúc
        const end = process.hrtime(start);
        const timeInMs = (end[0] * 1000 + end[1] / 1e6).toFixed(2);

        console.log(`\x1b[32m⚡️ [CACHE HIT] ${key} - Time: ${timeInMs}ms \x1b[0m`);
        
        return res.json(JSON.parse(cachedData));
      }

      console.log(`🐢 [CACHE MISS] ${key}`);

      const originalJson = res.json;

      res.json = (body: any): any => {
        // Chỉ lưu cache nếu Redis đang mở và request thành công
        if (res.statusCode === 200 && redisClient.isOpen) {
            redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(body))
                .catch(err => console.error('Redis Set Error:', err));
        }
        
        const end = process.hrtime(start);
        const timeInMs = (end[0] * 1000 + end[1] / 1e6).toFixed(2);
        console.log(`\x1b[33m🐢 [DB QUERY] ${key} - Time: ${timeInMs}ms \x1b[0m`);

        return originalJson.call(res, body);
      };

      next();
    } catch (err) {
      console.error('Redis Middleware Error:', err);
      // Nếu lỗi, vẫn cho request đi tiếp chứ không chặn user
      next();
    }
  };
};