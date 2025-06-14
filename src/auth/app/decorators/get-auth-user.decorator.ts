import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type AuthUser = {
  userId: number;
  username: string;
};

export const GetAuthUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
