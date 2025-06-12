import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GetProfileDto } from './dtos/responses/get-profile.dto';
import { GetProfileSwagger } from './get-profile.swagger';
import { GetProfileConverter } from './get-profile.converter';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class GetProfileAction {
  constructor(private readonly converter: GetProfileConverter) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @GetProfileSwagger()
  async getProfile(@Req() req): Promise<GetProfileDto> {
    return this.converter.toDto(req.user);
  }
}
