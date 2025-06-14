import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

export type ProtectedActionOptions = {
  tag: string;
  summary?: string;
  additionalResponses?: Array<{
    status: number;
    description: string;
    type?: any;
  }>;
};

export const ProtectedAction = (options: ProtectedActionOptions) => {
  const commonResponses = [
    {
      status: 401,
      description: 'Unauthorized - Invalid or missing JWT token.',
    },
    {
      status: 403,
      description:
        'Forbidden - User does not have permission for this resource.',
    },
    ...(options.additionalResponses || []),
  ];

  const responseDecorators = commonResponses.map((response) =>
    ApiResponse({
      status: response.status,
      description: response.description,
      type: response.type,
    }),
  );

  return applyDecorators(
    ApiTags(options.tag),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    ...(options.summary
      ? [ApiResponse({ status: 200, description: options.summary })]
      : []),
    ...responseDecorators,
  );
};
