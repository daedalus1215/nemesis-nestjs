import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, IsNotEmpty, IsBoolean, IsNumber, IsEnum, Length, IsOptional, IsDate } from 'class-validator';

@Entity()
export class Account {
  @PrimaryGeneratedColumn({ type: 'int' })
  @IsNumber()
  id: number;

  @Column({ length: 50 })
  @IsString()
  @IsNotEmpty({ message: 'Account name cannot be empty' })
  @Length(1, 50, { message: 'Account name must be between 1 and 50 characters' })
  name: string;

  @Column({ default: false })
  @IsBoolean()
  isDefault: boolean;

  // ✅ Reference by ID only - no entity relationship to avoid cross-context coupling
  @Column()
  @IsNumber()
  ownerId: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'ASSET',
  })
  @IsEnum(['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'], {
    message: 'Account type must be one of: ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE'
  })
  accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @IsDate()
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @IsDate()
  updatedAt: Date;
}
