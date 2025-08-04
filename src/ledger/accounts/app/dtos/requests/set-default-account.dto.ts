import { IsString } from 'class-validator';

export class SetDefaultAccountDto {
  @IsString()
  accountId: string;
}