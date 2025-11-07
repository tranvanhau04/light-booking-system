import axios from 'axios';

// (Hãy đảm bảo IP này 100% là đúng: 192.168.1.46)
const API_URL = 'http://192.168.1.29:5000/api'; 

// Định nghĩa kiểu (Interface) của data trả về
export interface BestCity {
  destinationId: string;
  name: string; // Tên (ví dụ: 'John F Kennedy')
  priceFrom: number;
  priceTo: number;
}

/**
 * @desc    Lấy 3 thành phố tốt nhất (từ bảng Flight)
 */
export const getBestCities = async (): Promise<BestCity[]> => {
  try {
    const response = await axios.get(`${API_URL}/destinations/best`);
    return response.data;
  } catch (error: any) {
    console.error('Lỗi khi tải "best cities":', error.response?.data || error.message);
    throw error;
  }
};