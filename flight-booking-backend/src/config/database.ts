const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'flight_booking',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mariadb',
    dialectOptions: {
      timezone: '+07:00',
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('? MariaDB connected successfully');
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('? Database synced');
    }
  } catch (error) {
    console.error('? Unable to connect to MariaDB:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
