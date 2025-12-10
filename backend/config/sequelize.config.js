const { Sequelize } = require("sequelize");
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'DB_DIALECT', 'DB_PORT'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const config = {
  USER: process.env.DB_USER,
  HOST: process.env.DB_HOST,
  DATABASE: process.env.DB_NAME,
  PASSWORD: process.env.DB_PASSWORD,
  DIALECT: process.env.DB_DIALECT,
  PORT: process.env.DB_PORT,
};

const sequelize = new Sequelize(config.DATABASE, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT,
  port: config.PORT,
  logging: console.log,
});

module.exports = sequelize;
