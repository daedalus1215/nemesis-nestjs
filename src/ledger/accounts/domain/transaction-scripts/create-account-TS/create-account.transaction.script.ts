import { Injectable } from '@nestjs/common';
import { Account } from '../../entities/account.entity';
import { AccountRepository } from '../../../infra/repositories/account.repository';

export type CreateAccountData = {
  userId: number;
  name: string;
  setAsDefault: boolean;
  accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
};

@Injectable()
export class CreateAccountTransactionScript {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(data: CreateAccountData): Promise<Account> {
    const account = await this.accountRepository.create({
      name: data.name,
      isDefault: data.setAsDefault,
      ownerId: data.userId,
      accountType: data.accountType,
    });

    const savedAccount = await this.accountRepository.save(account);

    if (data.setAsDefault) {
      await this.accountRepository.setAsDefault(savedAccount.id, data.userId);
    }

    return savedAccount;
  }
}