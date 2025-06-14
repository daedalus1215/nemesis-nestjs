import { Injectable } from '@nestjs/common';
import { User } from 'src/shared/shared-entities/entities/user.entity';
import { RegisterUserResponseDto } from './dtos/responses/register-user-response.dto';

@Injectable()
export class RegisterUserConverter {
  public toResponse(entity: User): RegisterUserResponseDto {
    return {
      ...entity,
      id: entity.id.toString(),
    };
  }
}
