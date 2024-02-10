import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { db } from 'src/db';
import { createId } from '@paralleldrive/cuid2';
import { hash, verify } from 'argon2';
import { JwtPayload, sign, verify as verifyJWT } from 'jsonwebtoken';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  async register(body: RegisterDTO) {
    const { password, username } = body;

    const olderUser = await db
      .selectFrom('user')
      .where((eb) => eb.or([eb('username', '=', username)]))
      .executeTakeFirst();

    if (olderUser)
      throw new HttpException(
        'A user with username already exists',
        HttpStatus.CONFLICT,
      );

    const user = await db
      .insertInto('user')
      .values({
        id: createId(),
        username: username,
        password: await hash(password, { saltLength: 10 }),
      })
      .returningAll()
      .executeTakeFirst();

    const token = sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });

    return {
      user: {
        id: user.id,
        username: user.username,
      },
      token,
    };
  }

  async login(body: LoginDTO) {
    const { password, username } = body;

    const user = await db
      .selectFrom('user')
      .selectAll()
      .where('username', '=', username)
      .executeTakeFirst();
    if (!user)
      throw new HttpException(
        'No User Found with given username',
        HttpStatus.NOT_FOUND,
      );
    const isPasswordSame = await verify(user.password, password);
    if (isPasswordSame === false)
      throw new HttpException('Incorrect Password', HttpStatus.FORBIDDEN);
    const token = sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });
    return {
      user: {
        id: user.id,
        username: user.username,
      },
      token,
    };
  }

  async verify(token: string) {
    try {
      const res = verifyJWT(token, process.env.JWT_SECRET) as JwtPayload & {
        id: string;
      };
      const user = await db
        .selectFrom('user')
        .selectAll()
        .where('id', '=', res.id)
        .executeTakeFirst();
      if (!user)
        throw new HttpException('No user found.', HttpStatus.NOT_FOUND);
      return {
        id: user.id,
        username: user.username,
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Invalid or Expired Token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
