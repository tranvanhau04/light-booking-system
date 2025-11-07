import axios from 'axios';

// 10.0.2.2 là localhost khi dùng máy ảo Android.
// (Hãy đảm bảo IP này đúng và khớp với các file service khác)
const API_URL = 'http://192.168.1.29:5000/api';

// Định nghĩa kiểu (Interface) của data trả về
export interface BaggageOption {
  optionId: string; // <-- ĐÃ SỬA
  type: string;
  weight: string;
  price: number;
}

/**
 * @desc    Lấy tất cả lựa chọn hành lý từ backend
 */
export const getBaggageOptions = async (): Promise<BaggageOption[]> => {
  try {
    const response = await axios.get(`${API_URL}/options/baggage`);
    return response.data;
  } catch (error: any) {
    console.error('Lỗi khi tải dữ liệu hành lý:', error.response?.data || error.message);
    throw error; // Ném lỗi để màn hình (screen) bắt
  }
};