import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, loginUserSchema } from './dtos/Login-Dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(200)
  @ApiOperation({ summary: 'Sign-in the registered user' })
  async login(@Body() loginDto: LoginDto) {
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
