import axios from 'axios';
import { getToken } from './userService'; 

// === CẬP NHẬT IP CỦA BẠN TẠI ĐÂY ===
const API_URL = 'http://192.168.1.31:5000/api'; 

// ====================================================================
// 1. KHAI BÁO CÁC HÀM RIÊNG LẺ (Để hỗ trợ code cũ createBooking)
// ====================================================================

/**
 * Tạo một booking mới
 */
export const createBooking = async (bookingData: any) => {
  try {
    const token = await getToken();
    if (!token) throw new Error('Chưa đăng nhập');

    const response = await axios.post(`${API_URL}/bookings`, bookingData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Create Booking Error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Lấy lịch sử đặt vé của user
 */
export const getUserBookings = async (userId: string) => {
  try {
    const token = await getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.get(`${API_URL}/bookings/user/${userId}`, {
      headers
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Get User Bookings Error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Lấy chi tiết 1 booking
 */
export const getBookingById = async (id: string) => {
  try {
    const token = await getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.get(`${API_URL}/bookings/${id}`, {
       headers
    });
    return response.data;
  } catch (error: any) {
    console.error('Get Booking Detail Error:', error);
    throw error;
  }
};

// ====================================================================
// 2. GOM VÀO OBJECT (Để hỗ trợ code mới BookingHistoryScreen)
// ====================================================================
export const bookingService = {
  createBooking,
  getUserBookings,
  getBookingById
};

// Xuất mặc định để tránh lỗi nếu có file nào import default
export default bookingService;