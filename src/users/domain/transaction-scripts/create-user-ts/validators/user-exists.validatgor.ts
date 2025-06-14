import { ConflictException, Injectable } from '@nestjs/common';
import { User } from 'src/shared/shared-entities/entities/user.entity';

@Injectable()
export class UserExistsValidator {
  async apply(existingUser: User | null): Promise<void> {
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
  }
}
