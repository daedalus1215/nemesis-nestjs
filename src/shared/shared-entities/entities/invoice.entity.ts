import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Balance } from './balance.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 20, scale: 8 })
  amount: number;

  @Column({ type: 'varchar', length: 3 })
  currency: string;

  @ManyToOne(() => User, { nullable: false })
  issuer: User;

  @ManyToOne(() => User, { nullable: false })
  recipient: User;

  @ManyToOne(() => Balance, { nullable: false })
  fromBalance: Balance;

  @ManyToOne(() => Balance, { nullable: false })
  toBalance: Balance;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID' | 'CANCELLED';

  @Column({ type: 'jsonb', nullable: true })
  signatures: {
    userId: string;
    signature: string;
    timestamp: string;
  }[];

  @Column({ type: 'varchar', nullable: true })
  rejectionReason: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dueDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
