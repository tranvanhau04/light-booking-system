import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Lấy cấu trúc User từ schema của bạn
interface User {
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  accountId: string;
  // Thêm các trường 'memberLevel' và 'points' từ ProfileScreen
  memberLevel?: string;
  points?: number;
}

// 2. Định nghĩa Context
interface IAuthContext {
  user: User | null;
  isLoading: boolean; // Thêm trạng thái loading cho auth
  authLogin: (userData: User) => void;
  authLogout: () => void;
  // Giả lập hàm lấy user (sẽ dùng ở LoginScreen)
  fetchUserDetails: (accountId: string) => Promise<User>;
}

// 3. Tạo Context
const AuthContext = createContext<IAuthContext | undefined>(undefined);

// 4. Tạo Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Bắt đầu là true

  // Giả lập API lấy chi tiết user (dựa trên schema của bạn)
  const fetchUserDetails = (accountId: string): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Đây là dữ liệu giả lập cho Bảng 'User'
        const fullUserDetails: User = {
          userId: 'U001',
          fullName: 'Pedro Moreno',
          email: 'pedro.moreno@gmail.com',
          phone: '+120656789',
          dateOfBirth: '1992-03-10',
          nationality: 'USA',
          accountId: accountId,
          memberLevel: 'Gold Member',
          points: 5420,
        };
          resolve(fullUserDetails);
      }, 500); // Giả lập 0.5 giây gọi API
    });
  };

  const authLogin = (userData: User) => {
    setUser(userData);
    setIsLoading(false);
  };

  const authLogout = () => {
    setUser(null);
    // (Trong app thật: xóa token khỏi AsyncStorage)
  };

  // (Trong app thật: bạn sẽ thêm 1 useEffect ở đây để
  // kiểm tra token trong AsyncStorage khi app mở)
  // useEffect(() => { ... setIsLoading(false) }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        authLogin,
        authLogout,
        fetchUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 5. Tạo Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng bên trong AuthProvider');
  }
  return context;
};