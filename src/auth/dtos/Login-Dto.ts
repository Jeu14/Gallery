import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Email must be valid',
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),
});

export class LoginDto {
  @ApiProperty({
    description: 'Email of the user trying to login',
    example: 'johndoe@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Password of the user trying to login',
    example: 'password123',
  })
  password: string;
}
