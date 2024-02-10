import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/resources/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(protected readonly authService: AuthService) {}
  async use(req: Request & { auth: any }, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization;
      if (!token) throw Error();
      req.auth = await this.authService.verify(
        token.startsWith('Bearer ') ? token.replaceAll('Bearer ', '') : token,
      );
      next();
    } catch (e) {
      throw new HttpException(
        'Missing or Expired Token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
