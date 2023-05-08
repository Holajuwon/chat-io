import rootPath from 'app-root-path';
import development from './development';
import test from './test';
import production from './production';

const {
  INBEV_PORT: PORT,
  INBEV_SECRET: SECRET,
  INBEV_NODE_ENV: NODE_ENV,
} = process.env;

const currentEnv = {
  development,
  test,
  production,
}[NODE_ENV || 'development'];

export default {
  ...process.env,
  ...currentEnv,
  rootPath,
  PORT,
  SECRET,
  NODE_ENV,
};
