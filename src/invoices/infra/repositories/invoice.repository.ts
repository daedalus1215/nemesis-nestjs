import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Invoice, INVOICE_STATUS } from '../../domain/entities/invoice.entity';

@Injectable()
export class InvoiceRepository {
  constructor(
    @InjectRepository(Invoice)
    private readonly repository: Repository<Invoice>,
  ) {}

  async findPendingByDebtorUserId(userId: number): Promise<Invoice[]> {
    return this.repository.find({
      where: {
        debtorUserId: userId,
        status: In([INVOICE_STATUS.SENT, INVOICE_STATUS.OVERDUE]),
      },
      order: { dueDate: 'ASC' },
    });
  }

  async findCompletedByDebtorUserId(userId: number): Promise<Invoice[]> {
    return this.repository.find({
      where: {
        debtorUserId: userId,
        status: INVOICE_STATUS.PAID,
      },
      order: { dueDate: 'DESC' },
    });
  }

  async findPendingByIssuerUserId(userId: number): Promise<Invoice[]> {
    return this.repository.find({
      where: {
        issuerUserId: userId,
        status: In([INVOICE_STATUS.SENT, INVOICE_STATUS.OVERDUE]),
      },
      order: { dueDate: 'ASC' },
    });
  }

  async findCompletedByIssuerUserId(userId: number): Promise<Invoice[]> {
    return this.repository.find({
      where: {
        issuerUserId: userId,
        status: INVOICE_STATUS.PAID,
      },
      order: { dueDate: 'DESC' },
    });
  }
}

