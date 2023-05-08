import { Helper, constants } from '../utils';
import adminRoute from '../user/route/auth.route';

const { successResponse } = Helper;
const { WELCOME, v1 } = constants;

class Routes {
  static routes(app) {
    app.get(`${v1}`, (req, res) => successResponse(res, { message: WELCOME }));
    app.use(`${v1}/user`, adminRoute);
  }
}

export default Routes;
