import { Request, Response, NextFunction } from 'express'; // <-- ĐÃ SỬA Ở ĐÂY
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import config from '../config/env';

// Mở rộng kiểu Request của Express để thêm thuộc tính 'user'
export interface IAuthRequest extends Request { // <-- Giờ đây 'Request' đã được hiểu đúng
  user?: {
    userId: string;
    accountId: string;
    fullName?: string;
  };
}

export const auth = (req: IAuthRequest, res: Response, next: NextFunction) => {
  // 1. Lấy token từ header
  const authHeader = req.header('Authorization'); // <-- Sẽ không còn lỗi

  // 2. Kiểm tra xem có token không
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. Kiểm tra xem token có đúng định dạng "Bearer <token>" không
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Token format is invalid' });
  }

  // 4. Xác thực token
  try {
    const decoded = jwt.verify(
      token,
      config.JWT_SECRET
    ) as { user: { userId: string; accountId: string } };

    // 5. Gắn thông tin user đã giải mã vào đối tượng `req`
    req.user = decoded.user;
    next(); 
    
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};