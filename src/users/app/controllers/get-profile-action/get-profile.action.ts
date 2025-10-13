import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { GetProfileDto } from './dtos/responses/get-profile.dto';
import { GetProfileSwagger } from './get-profile.swagger';
import { GetProfileConverter } from './get-profile.converter';
import { ProtectedAction } from 'src/shared/application/protected-action-options';

@Controller('users')
export class GetProfileAction {
  constructor(private readonly converter: GetProfileConverter) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ProtectedAction({
    tag: 'User',
    summary: 'Get profile',
  })
  @GetProfileSwagger()
  async getProfile(@Req() req): Promise<GetProfileDto> {
    return this.converter.toDto(req.user);
  }
}
