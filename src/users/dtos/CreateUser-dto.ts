import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'User name is required',
    'string.base': 'User name must be a string',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'User email is required',
    'string.email': 'User email must be valid',
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),
});

export class CreateUserDto {
  @ApiProperty({
    description: 'Name of the user to be created',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Email of the user to be created',
    example: 'johndoe@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Password of the user to be created',
    example: 'password123',
  })
  password: string;
}
