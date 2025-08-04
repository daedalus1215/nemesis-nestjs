import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ default: false })
  isDefault: boolean;

  // ✅ Reference by ID only - no entity relationship to avoid cross-context coupling
  @Column()
  ownerId: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'ASSET',
  })
  accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
