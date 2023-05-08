import 'dotenv/config';

export default {
  DATABASE_URL: process.env.INBEV_DATABASE_TEST_URL,
  NODE_ENV: process.env.INBEV_NODE_ENV,
  JWT_EXPIRY: process.env.INBEV_JWT_EXPIRY,
  JWT_SECRET: process.env.INBEV_JWT_SECRET,
};
