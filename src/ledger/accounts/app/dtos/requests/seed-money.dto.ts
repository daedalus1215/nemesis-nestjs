import { IsNumber, IsOptional, IsString, IsPositive, Min } from 'class-validator';

export class SeedMoneyDto {
  @IsNumber()
  @Min(1, { message: 'User ID must be a positive number' })
  userId: number;

  @IsNumber()
  @IsPositive({ message: 'Amount must be positive' })
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}
