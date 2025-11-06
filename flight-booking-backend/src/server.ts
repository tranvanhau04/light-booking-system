import { sequelize } from './models';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected!');
    await sequelize.sync(); // hoặc { force: true } để reset
  } catch (err) {
    console.error('❌ Database connection error:', err);
  }
})();
