import { Request, Response } from 'express';
// 1. SỬA IMPORT: Dùng Model "Menu" mới
import { BaggageOption } from '../models/BaggageOption'; 

/**
 * @route   GET /api/options/baggage
 * @desc    Lấy các lựa chọn hành lý từ "Thực đơn" (Menu)
 */
export const getBaggageOptions = async (req: Request, res: Response) => {
  try {
    // 2. SỬA LOGIC: Đọc từ Bảng "Menu"
    const options = await BaggageOption.findAll(); 

    res.json(options);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};