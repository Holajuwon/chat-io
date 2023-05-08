import promise from 'bluebird';
import pg from 'pg-promise';
import config from '../../env';

const options = {
  promiseLib: promise,
};

const pgp = pg(options);
const db = pgp(config.DATABASE_URL);

export default db;
