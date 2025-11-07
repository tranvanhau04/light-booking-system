import axios from 'axios';
import { getToken } from './userService'; // Import hàm getToken

// 10.0.2.2 là localhost khi dùng máy ảo Android.
// Thay bằng IP máy tính của bạn nếu dùng điện thoại thật.
const API_URL = 'http://192.168.1.29:5000/api';

/**
 * Tạo một booking mới
 * (bookingData là đối tượng JSON bạn gửi lên, giống hệt Postman)
 */
export const createBooking = async (bookingData: any) => {
  try {
    // 1. Lấy token từ AsyncStorage
    const token = await getToken();

    if (!token) {
      throw new Error('Chưa đăng nhập');
    }

    // 2. Gọi API với token trong header
    const response = await axios.post(`${API_URL}/bookings`, bookingData, {
      headers: {
        Authorization: `Bearer ${token}`, // <-- Gửi token ở đây
      },
    });

    // Trả về booking đã tạo thành công
    return response.data;

  } catch (error: any) { // <-- SỬA Ở ĐÂY
    console.error('Lỗi khi tạo booking:', error.response?.data || error.message);
    throw error; // <-- SỬA Ở ĐÂY: Ném lỗi đầy đủ
  }
};

/**
 * Lấy lịch sử đặt vé của người dùng
 */
export const getMyBookings = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('Chưa đăng nhập');
    }

    // API 'my-bookings' này CHƯA được tạo ở backend,
    // bạn sẽ cần tạo nó sau.
    const response = await axios.get(`${API_URL}/bookings/my-bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;

  } catch (error: any) { // <-- SỬA Ở ĐÂY
    console.error('Lỗi khi lấy lịch sử booking:', error.response?.data || error.message);
    throw error; // <-- SỬA Ở ĐÂY: Ném lỗi đầy đủ
  }
};