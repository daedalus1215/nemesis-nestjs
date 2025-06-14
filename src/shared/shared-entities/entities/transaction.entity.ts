import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Balance } from './balance.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 20, scale: 8 })
  amount: number;

  @ManyToOne(() => Balance, (balance) => balance.outgoingTransactions, {
    nullable: false,
  })
  fromBalance: Balance;

  @ManyToOne(() => Balance, (balance) => balance.incomingTransactions, {
    nullable: false,
  })
  toBalance: Balance;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
