import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetProfileDto } from './dtos/responses/get-profile.dto';

export const GetProfileSwagger = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get user profile' }),
    ApiResponse({
      status: 200,
      description: 'User profile retrieved successfully',
      type: GetProfileDto,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
};
