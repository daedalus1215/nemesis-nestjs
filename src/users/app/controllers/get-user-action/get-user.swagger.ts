import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserDto } from 'src/users/app/controllers/get-user-action/dtos/responses/get-user.dto';

export const GetUsersSwagger = () => {
  return applyDecorators(
    ApiTags('users'),
    ApiOperation({ summary: 'Get list of all users' }),
    ApiResponse({
      status: 200,
      description: 'List of users retrieved successfully',
      type: [GetUserDto],
    }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
};
