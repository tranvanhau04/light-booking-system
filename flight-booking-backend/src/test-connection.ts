import { connectDB, sequelize } from './config/database';
import { QueryTypes } from 'sequelize';
(async () => {
  try {
    await connectDB();

    // Kiểm tra danh sách bảng (có thể bỏ nếu không cần)
    const [results] = await sequelize.query('SHOW TABLES;', {
      type: QueryTypes.SELECT,
      raw: true,
    });
    console.log('📋 Tables:', results);

    await sequelize.close();
    console.log('🔌 Connection closed.');
  } catch (error: any) {
    console.error('❌ Error while testing connection:', error.message);
  }
})();
