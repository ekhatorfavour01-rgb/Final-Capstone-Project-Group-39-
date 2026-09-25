require('dotenv').config();

const requiredVars = ['MONGO_URI', 'JWT_SECRET', 'PORT'];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Error: Environment variable '${key}' is not set`);
    process.exit(1);
  }
});

module.exports = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d', // Default to 7 days if not set
    NODE_ENV: process.env.NODE_ENV || 'development', // Default to 'development' if not set
};