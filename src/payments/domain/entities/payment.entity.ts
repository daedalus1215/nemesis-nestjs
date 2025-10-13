import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


export const PaymentCategory = {
  POS: 'POS',
  INVOICE_PAYMENT: 'INVOICE_PAYMENT',
  PREPAYMENT: 'PREPAYMENT',
  REFUND: 'REFUND',
  PAYOUT: 'PAYOUT',
  FEE: 'FEE',
  ADJUSTMENT: 'ADJUSTMENT',
} as const;

export type PaymentCategoryType = typeof PaymentCategory[keyof typeof PaymentCategory];
export const PaymentStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  VOID: 'VOID',
} as const;
export type PaymentStatusType = typeof PaymentStatus[keyof typeof PaymentStatus];

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  //@TODO: Switch to payer

  @Column()
  debitAccountId: number;  // Account losing money (asset decreases)

  //@TODO: Switch to payee
  @Column()
  creditAccountId: number; // Account gaining money (asset increases)

  @Column({ type: 'varchar', nullable: true })
  description: string;

  //@TODO: Switch to type
  @Column({ type: 'varchar', length: 50, default: 'POS' })
  category: PaymentCategoryType;

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: PaymentStatusType;

  // Optional: Store user IDs for easier querying (denormalized for performance)
  @Column({ nullable: true })
  initiatingUserId: number;

  @Column({ nullable: true })
  counterpartyUserId: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}