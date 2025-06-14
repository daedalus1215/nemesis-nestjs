import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/domain/services/users.service';
import { GetUserConverter } from './get-user.converter';
import { GetUserDto } from './dtos/responses/get-user.dto';
import { GetUsersSwagger } from './get-user.swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('users') // Tagging the controller for Swagger
@Controller('users')
export class GetUserAction {
  constructor(
    private readonly usersService: UsersService,
    private readonly converter: GetUserConverter,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @GetUsersSwagger()
  @UseGuards(JwtAuthGuard)
  async getUsers(): Promise<GetUserDto[]> {
    return this.converter.apply(await this.usersService.getUsers());
  }
}
