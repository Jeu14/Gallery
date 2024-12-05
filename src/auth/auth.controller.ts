import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginUserSchema } from './dtos/Login-Dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  async login(@Body() loginDto: any) {
    const { error } = loginUserSchema.validate(loginDto);
    if (error) {
      throw new BadRequestException(error.details.map((err) => err.message));
    }
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return this.authService.login(user);
  }
}
