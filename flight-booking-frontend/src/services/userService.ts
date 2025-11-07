import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 10.0.2.2 là localhost khi dùng máy ảo Android.
// Thay bằng IP máy tính của bạn nếu dùng điện thoại thật.
const API_URL = 'http://192.168.1.29:5000/api';

/**
 * Đăng ký tài khoản mới
 */
export const register = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    
    // Tự động lưu token sau khi đăng ký thành công
    const { token } = response.data;
    if (token) {
      await AsyncStorage.setItem('user_token', token);
    }
    return response.data;
  } catch (error: any) {
    console.error('Lỗi đăng ký:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Đăng nhập và lưu token
 */
export const login = async (userName: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      userName,
      password,
    });

    const { token } = response.data;

    // Lưu token vào AsyncStorage
    if (token) {
      await AsyncStorage.setItem('user_token', token);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Lỗi đăng nhập:', error.response?.data || error.message);
    throw error; // Ném lỗi đầy đủ
  }
};

/**
 * Đăng xuất (Xóa token)
 */
export const logout = async () => {
  try {
    await AsyncStorage.removeItem('user_token');
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error);
  }
};

/**
 * Lấy token đã lưu
 */
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('user_token');
  } catch (error) {
    console.error('Lỗi khi lấy token:', error);
    return null;
  }
};

/**
 * Lấy thông tin người dùng hiện tại (cho trang Profile)
 */
export const getMe = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('Chưa đăng nhập');
    }

    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;

  } catch (error: any) {
    console.error('Lỗi khi lấy thông tin user:', error.response?.data || error.message);
    throw error;
  }
};