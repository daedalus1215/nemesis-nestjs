import { IsNumber, IsPositive, IsOptional, IsString, IsInt } from 'class-validator';

export class TransferBetweenAccountsDto {
  @IsInt()
  @IsPositive()
  fromAccountId: number;

  @IsInt()
  @IsPositive()
  toAccountId: number;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}