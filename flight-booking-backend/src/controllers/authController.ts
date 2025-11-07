import { Request, Response } from 'express';
import { Account } from '../models/Account';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/env'; // Import config của bạn

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký tài khoản mới
 */
export const register = async (req: Request, res: Response) => {
  const { userName, password, fullName, email } = req.body;

  try {
    // 1. Kiểm tra xem 'userName' đã tồn tại chưa
    let account = await Account.findOne({ where: { userName } });
    if (account) {
      return res.status(400).json({ msg: 'Tên đăng nhập đã tồn tại' });
    }

    // 2. Tạo Account
    account = Account.build({ userName, password });

    // 3. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    account.password = await bcrypt.hash(password, salt);

    // Lưu Account vào DB
    await account.save();

    // 4. Tạo User (liên kết với Account)
    const newUser = await User.create({
      fullName,
      email,
      accountId: account.accountId,
    });

    // 5. Tạo và trả về token
    const payload = {
      user: {
        userId: newUser.userId,
        accountId: account.accountId,
        // Thêm các thông tin khác bạn muốn vào token
      },
    };

    jwt.sign(
      payload,
      config.JWT_SECRET,
      { expiresIn: '5h' }, // Token hết hạn sau 5 giờ
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token }); // Trả về token
      }
    );
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập
 */
export const login = async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  try {
    // 1. Kiểm tra 'userName'
    const account = await Account.findOne({ where: { userName } });
    if (!account) {
      return res.status(400).json({ msg: 'Sai thông tin đăng nhập' });
    }

    // 2. So sánh mật khẩu
    // const isMatch = await bcrypt.compare(password, account.password);
    const isMatch = (password === account.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Sai thông tin đăng nhập' });
    }

    // 3. Lấy thông tin User liên quan
    const user = await User.findOne({ where: { accountId: account.accountId } });
    if (!user) {
        return res.status(404).json({ msg: 'Không tìm thấy dữ liệu người dùng' });
    }

    // 4. Tạo và trả về token
    const payload = {
      user: {
        userId: user.userId, // Đây là thứ `auth` middleware sẽ đọc
        accountId: account.accountId,
        fullName: user.fullName,
      },
    };

    jwt.sign(
      payload,
      config.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Trả về token
      }
    );
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};