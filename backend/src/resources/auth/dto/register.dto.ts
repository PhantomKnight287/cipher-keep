import { IsAlphanumeric, IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsAlphanumeric()
  username: string;

  @IsString()
  @MinLength(8, { message: 'password must be 8 characters long' })
  password: string;
}
