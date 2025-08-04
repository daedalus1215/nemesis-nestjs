import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 20, scale: 8 })
  amount: number;

  // Double-entry: Every transaction affects two accounts
  @Column()
  debitAccountId: number;  // Account losing money (asset decreases)

  @Column()
  creditAccountId: number; // Account gaining money (asset increases)

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'transfer' })
  category: string; // e.g., 'transfer', 'payment', 'fee', 'interest'

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

  // Optional: Store user IDs for easier querying (denormalized for performance)
  @Column({ nullable: true })
  initiatingUserId: number;

  @Column({ nullable: true })
  counterpartyUserId: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Business rule: Accounts must be different
  // Business rule: Amount must be positive
  // Business rule: Status transitions must be valid
}