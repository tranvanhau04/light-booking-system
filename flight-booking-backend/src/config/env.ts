// src/config/env.ts

/**
 * Đây là nơi quản lý tập trung tất cả các biến môi trường
 * và cấu hình cho ứng dụng của bạn.
 */
export const config = {
  /**
   * Cổng (port) mà backend server sẽ chạy.
   * process.env.PORT được dùng khi bạn deploy lên một dịch vụ (như Heroku).
   * 5000 là cổng mặc định khi chạy ở máy bạn (localhost).
   */
  port: process.env.PORT || 5000,

  /**
   * Chuỗi kết nối đến cơ sở dữ liệu của bạn.
   * Bạn CẦN thay thế 'YOUR_DATABASE_CONNECTION_STRING' 
   * bằng chuỗi kết nối thực tế của bạn (ví dụ: postgresql://user:pass@host:port/dbname)
   */
  databaseUrl: 'mysql://root:sapassword@localhost:3306/flight_booking',

  /**
   * Chìa khóa bí mật (secret key) để mã hóa và giải mã JSON Web Tokens (JWT).
   * Bạn có thể thay 'mysecretkey123' bằng bất kỳ chuỗi ngẫu nhiên nào.
   * Đây là chìa khóa mà file `auth.ts` của bạn sẽ sử dụng.
   */
  JWT_SECRET: 'mysecretkey123'
};

// Export default để dễ dàng import ở các file khác
export default config;