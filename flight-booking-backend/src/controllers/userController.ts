import { Response } from 'express';
import { User } from '../models/User';
import { IAuthRequest } from '../middleware/auth'; // Import IAuthRequest

/**
 * @route   GET /api/users/me
 * @desc    Lấy thông tin người dùng hiện tại (đã đăng nhập)
 */
export const getMe = async (req: IAuthRequest, res: Response) => {
  try {
    // req.user.userId đã được gán bởi 'auth' middleware
    const userId = req.user?.userId; 
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }, // Không trả về password
    });

    if (!user) {
      return res.status(404).json({ msg: 'Không tìm thấy người dùng' });
    }

    res.json(user);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};