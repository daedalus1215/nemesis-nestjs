import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../../domain/entities/invoice.entity';
import { InvoiceRepositoryPort } from '../../balance/domain/repositories/invoice.repository';

@Injectable()
export class InvoiceRepository implements InvoiceRepositoryPort {
  constructor(
    @InjectRepository(Invoice)
    private readonly repository: Repository<Invoice>,
  ) {}

  async save(invoice: Invoice): Promise<Invoice> {
    return this.repository.save(invoice);
  }

  create(data: Partial<Invoice>): Invoice {
    return this.repository.create(data);
  }

  async findById(id: string): Promise<Invoice | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['issuer', 'recipient', 'fromBalance', 'toBalance'],
    });
  }
}
