import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  async signIn(@Body() input: LoginInput) {
    const token = await this.authService.signIn(input);
    return token;
  }
}
