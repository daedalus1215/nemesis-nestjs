import { User } from 'src/users/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { GetUserDto } from 'src/users/app/controllers/get-user-action/dtos/responses/get-user.dto';

@Injectable()
export class GetUserConverter {
  public apply(entities: User[]): GetUserDto[] {
    console.log(entities);
    return entities.map((entity) => ({
      username: entity.username,
      id: entity.id,
    }));
  }
}
