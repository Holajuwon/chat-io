/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import morgan from 'morgan';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import Routes from '../routes';
import { Helper, genericErrors } from '../utils';
import envValidator from '../validations/env';
import Logger from './logger';

const { errorResponse } = Helper;
const { notFoundApi } = genericErrors;

const { error } = envValidator();
if (error) {
  throw new Error(`Configuration validation error: ${error.message}`);
}

class AppConfig {
  constructor() {
    this.app = express();
    this.config();
  }

  config() {
    this.app.use(morgan('combined', { stream: Logger.stream }));

    // Use helmet to secure Express headers
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(json());

    this.app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Authorization, Origin, Content-Type, Accept',
      );
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
    });

    Routes.routes(this.app);

    this.app.use((req, res, next) => next(notFoundApi));

    // eslint-disable-next-line no-unused-vars
    this.app.use((err, req, res, next) => errorResponse(req, res, err));
  }
}

export default new AppConfig().app;
