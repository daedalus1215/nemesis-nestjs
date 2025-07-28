import { IsOptional, IsPositive, IsString, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetTransactionsPaginatedDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  @Max(50)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  cursor?: string; // Transaction ID for cursor-based pagination
}
