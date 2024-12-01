import { 
  Body, 
  Controller, 
  Get, 
  HttpCode, 
  HttpStatus, 
  Post, 
  Req, 
  UseGuards 
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/domain/services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { JwtAuthGuard } from 'src/auth/app/jwt-auth.guard';

@ApiTags('users') // Tagging the controller for Swagger
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // Indicates this route requires authentication
  @ApiOperation({ summary: 'Get user profile' }) // Description for the endpoint
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' }) // Description for the endpoint
  @ApiBody({ type: CreateUserDto }) // Documenting the request body
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return user;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of all users' }) // Description for the endpoint
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getUsers(): Promise<any> {
    return await this.usersService.getUsers();
  }
}
