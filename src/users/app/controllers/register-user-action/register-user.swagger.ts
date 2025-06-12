import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterUserDto } from './dtos/requests/register-user.dto';
import { RegisterUserResponseDto } from './dtos/responses/register-user-response.dto';

export const RegisterUserSwagger = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new user' }),
    ApiBody({ type: RegisterUserDto }),
    ApiResponse({
      status: 201,
      description: 'User registered successfully',
      type: RegisterUserResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Invalid input' }),
  );
};
