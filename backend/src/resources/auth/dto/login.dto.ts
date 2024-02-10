import { IsAlphanumeric, IsString, MinLength } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsAlphanumeric()
  username: string;

  @IsString()
  @MinLength(8, { message: 'password must be 8 characters long' })
  password: string;
}
