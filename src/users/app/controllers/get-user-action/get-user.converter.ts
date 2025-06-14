import { User } from 'src/shared/shared-entities/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { GetUserDto } from 'src/users/app/controllers/get-user-action/dtos/responses/get-user.dto';

@Injectable()
export class GetUserConverter {
  public userToDto(entities: User[]): GetUserDto[] {
    return entities.map((entity) => ({
      username: entity.username,
      id: entity.id.toString(),
    }));
  }
}
