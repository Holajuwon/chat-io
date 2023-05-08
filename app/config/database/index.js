import db from './setup/postgres';
import AuthQuery from '../../user/query';

const queries = {
  AuthQuery,
};

export default {
  transact: (query, data, type) => db.any(queries[type][query], data),
  queryOneOrNone: (query, data, type) => db.oneOrNone(queries[type][query], data),
  nestedTransaction: (query, data, identifiers, type) => db.tx((t) => {
    const sqlParam = [];
    data.forEach((item) => {
      const payload = [];
      identifiers.map((identifer) => payload.push(item[identifer]));
      sqlParam.push(t.any(queries[type][query], payload));
    });
    return t.batch(sqlParam);
  }),
  multipleTransaction: (transactions) => db.tx((t) => t.batch(transactions)),

  batchTransaction: (transaction) => db.tx((t) => {
    const data = transaction.map((el) => {
      const [query, payload, type] = el;
      return t.any(queries[type][query], payload);
    });
    return t.batch(data);
  }),
};
