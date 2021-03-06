import autobind from 'autobind-decorator';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { TYPES } from '../../../../../app/config/types';
import { Response, Request, NextFunction } from 'express';
import responseBuilder from '../../../utils/responseBuilder';
import AuthManager from '../../../../integration/modules/auth/auth.manager';

@autobind
@injectable()
export default class AuthController {
  constructor(@inject(TYPES.AuthManager) private authManager: AuthManager) {}

  async singIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const token = await this.authManager.getToken(
        req.body.username,
        req.body.password
      );
      if (!token) {
        return next({
          message: 'Invalid Credentials',
          statusCode: StatusCodes.UNAUTHORIZED,
        });
      }
      return res.json({ token });
    } catch (error) {
      return next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const user = await this.authManager.getUser(req.filter);
      return res.json(responseBuilder(user, req.filter.target));
    } catch (error) {
      next(error);
    }
  }
}
