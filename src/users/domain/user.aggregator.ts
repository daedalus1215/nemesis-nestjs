import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/infrastructure/user.repository';

type UserInfo = {
  id: number;
  username: string;
};

@Injectable()
export class UserAggregator {
  constructor(private readonly repository: UserRepository) {}

  async getUsersByIds(userIds: number[]): Promise<UserInfo[]> {
    if (userIds.length === 0) return [];

    try {
      const users = await this.repository.findByIds(userIds);
      return users.map((user) => ({
        id: user.id,
        username: user.username,
      }));
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  }
}
