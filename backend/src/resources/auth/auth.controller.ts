import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDTO) {
    return await this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDTO) {
    return await this.authService.login(body);
  }

  @Get('hydrate')
  async hydrate(@Headers('authorization') header: string) {
    return await this.authService.verify(header.replace('Bearer ', ''));
  }
}
