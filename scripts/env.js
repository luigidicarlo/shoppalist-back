const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const pathToEnv = path.join(__dirname, '../.env');

function generateHash(length) {
  return crypto.randomBytes(Math.round(length / 2)).toString('hex');
}

const envVars = {
  PORT: 7070,
  MONGO_URI: 'mongodb://localhost:27017/shoppalist',
  JWT_SECRET: generateHash(32),
  JWT_REFRESH_SECRET: generateHash(32),
  JWT_ACCESS_EXP: '15m',
  JWT_REFRESH_EXP: '7d',
};

let envString = '';

for (const [key, value] of Object.entries(envVars)) {
  envString += `${key}=${typeof key === 'string' ? `"${value}"` : value}\n`;
}

if (fs.existsSync(pathToEnv)) fs.unlinkSync(pathToEnv);

fs.writeFileSync(pathToEnv, envString, { encoding: 'utf-8' });
