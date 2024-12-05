import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './dtos/UserResponse-dto';
import { createUserSchema } from './dtos/CreateUser-dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: any): Promise<UserResponseDto> {
    const { error } = createUserSchema.validate(createUserDto);
    if (error) {
      throw new BadRequestException(error.details.map((err) => err.message));
    }
    const user = await this.usersService.register(
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
    );
    const { password, createdAt, updatedAt, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
