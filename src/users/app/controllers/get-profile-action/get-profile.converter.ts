import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/entities/user.entity';
import { GetProfileDto } from './dtos/responses/get-profile.dto';

@Injectable()
export class GetProfileConverter {
  public toDto(entity: User): GetProfileDto {
    console.log(entity);
    return {
      username: entity.username,
      id: entity.id,
    };
  }
}
