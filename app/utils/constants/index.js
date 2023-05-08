import apiMessage from './api.message';
import dbUnique from './unique.constraints';
import regex from './regex';

export default {
  ...apiMessage,
  ...dbUnique,
  ...regex,
};
