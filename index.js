import https from 'http';
import config from './app/config';
import app from './app/config/app';
import Logger from './app/config/logger';
import db from './app/config/database/setup/postgres';
import { constants } from './app/utils';
import messageServer from './app/messages';

const { INBEV_RUNNING } = constants;
const server = https.createServer({}, app);
global.logger = Logger.createLogger({ label: 'INBEV CHAT' });

db.connect()
  .then((obj) => {
    const port = config.PORT || 3000;
    server.listen(port, async () => {
      messageServer(server);
      obj.done();
      logger.info(`${INBEV_RUNNING} ${port}`);
    });
  })
  .catch((error) => {
    logger.error(error.message);
  });

export default app;
