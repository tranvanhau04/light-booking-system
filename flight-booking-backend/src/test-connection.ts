import { connectDB, sequelize } from './config/database';
import { QueryTypes } from 'sequelize';
(async () => {
  try {
    await connectDB();

    const results = await sequelize.query('SHOW TABLES;', {
  type: QueryTypes.SELECT,
});
console.log('📋 Tables:', results.map((r: any) => Object.values(r)[0]));


    await sequelize.close();
    console.log('🔌 Connection closed.');
  } catch (error: any) {
    console.error('❌ Error while testing connection:', error.message);
  }
})();
