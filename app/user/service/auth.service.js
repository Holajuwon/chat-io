/* eslint-disable camelcase */
import { Helper } from '../../utils';
import DB from '../../config/database/index';

export default class AuthService {
  static async userSignup(body) {
    const { username, email, password } = body;
    const { salt, hashed } = Helper.hashPassword(password);
    await DB.transact('registerUser', [username, email, hashed, salt], 'AuthQuery');
  }

  static login(user) {
    const { id, email, username } = user;
    const token = Helper.generateToken({ id, email });
    return {
      id, username, email, token,
    };
  }

  static getUserByEmail(email) {
    return DB.queryOneOrNone(
      'getUserByEmail',
      email,
      'AuthQuery',
    );
  }

  static getUserById(id) {
    return DB.queryOneOrNone('getUserById', id, 'AuthQuery');
  }
}
