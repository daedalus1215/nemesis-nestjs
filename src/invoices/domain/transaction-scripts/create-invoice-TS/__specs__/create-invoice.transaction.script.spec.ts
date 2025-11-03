import { Test, TestingModule } from '@nestjs/testing';
import { CreateInvoiceTransactionScript } from '../create-invoice.transaction.script';
import { InvoiceRepository } from '../../../../infra/repositories/invoice.repository';
import { CreateInvoiceRequestDto } from '../../../../app/actions/create-invoice-action/create-invoice.request.dto';
import { Invoice, INVOICE_STATUS } from '../../../entities/invoice.entity';
import { createMockInvoice } from '../../../../../shared/test/invoice-test-utils';

describe('CreateInvoiceTransactionScript', () => {
  let target: CreateInvoiceTransactionScript;
  let invoiceRepository: jest.Mocked<InvoiceRepository>;

  const issuerUserId = 1;
  const debtorUserId = 2;
  const amount = 100.5;

  const createValidDto = (
    overrides?: Partial<CreateInvoiceRequestDto>,
  ): CreateInvoiceRequestDto => ({
    debtorUserId,
    amount,
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    description: 'Test invoice description',
    ...overrides,
  });

  beforeEach(async () => {
    const mockInvoiceRepository = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateInvoiceTransactionScript,
        {
          provide: InvoiceRepository,
          useValue: mockInvoiceRepository,
        },
      ],
    }).compile();

    target = module.get<CreateInvoiceTransactionScript>(
      CreateInvoiceTransactionScript,
    );
    invoiceRepository = module.get(InvoiceRepository);
  });

  describe('execute', () => {
    it('should create an invoice successfully', async () => {
      // Arrange
      const dto = createValidDto();
      const mockInvoice = createMockInvoice({
        issuerUserId,
        debtorUserId: dto.debtorUserId,
        total: dto.amount,
        balanceDue: dto.amount,
        status: INVOICE_STATUS.SENT,
        issueDate: new Date(),
        dueDate: new Date(dto.dueDate),
      });
      invoiceRepository.create.mockResolvedValue(mockInvoice);

      // Act
      const result = await target.execute(dto, issuerUserId);

      // Assert
      expect(result).toEqual(mockInvoice);
      expect(invoiceRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          issuerUserId,
          debtorUserId: dto.debtorUserId,
          total: dto.amount,
          balanceDue: dto.amount,
          status: INVOICE_STATUS.SENT,
          issueDate: expect.any(Date),
          dueDate: expect.any(Date),
        }),
      );
      const callArgs = invoiceRepository.create.mock.calls[0][0];
      const issueDate = callArgs.issueDate as Date;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expect(issueDate.getTime()).toBeGreaterThanOrEqual(today.getTime());
      expect(issueDate.getTime()).toBeLessThan(today.getTime() + 86400000);
    });

    it('should set balanceDue equal to total', async () => {
      // Arrange
      const dto = createValidDto();
      invoiceRepository.create.mockImplementation((invoice) =>
        Promise.resolve({ ...invoice, id: 1 } as Invoice),
      );

      // Act
      await target.execute(dto, issuerUserId);

      // Assert
      expect(invoiceRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          balanceDue: dto.amount,
          total: dto.amount,
        }),
      );
    });

    it('should set status to SENT', async () => {
      // Arrange
      const dto = createValidDto();
      invoiceRepository.create.mockImplementation((invoice) =>
        Promise.resolve({ ...invoice, id: 1 } as Invoice),
      );

      // Act
      await target.execute(dto, issuerUserId);

      // Assert
      expect(invoiceRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: INVOICE_STATUS.SENT,
        }),
      );
    });

    it('should handle invoice without description', async () => {
      // Arrange
      const dto = createValidDto({ description: undefined });
      invoiceRepository.create.mockImplementation((invoice) =>
        Promise.resolve({ ...invoice, id: 1 } as Invoice),
      );

      // Act
      await target.execute(dto, issuerUserId);

      // Assert
      expect(invoiceRepository.create).toHaveBeenCalled();
    });

    it('should throw error when due date is in the past', async () => {
      // Arrange
      const dto = createValidDto({
        dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      });

      // Act & Assert
      await expect(target.execute(dto, issuerUserId)).rejects.toThrow(
        'Due date must be in the future',
      );
      expect(invoiceRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when due date is today', async () => {
      // Arrange
      const dto = createValidDto({
        dueDate: new Date().toISOString().split('T')[0],
      });

      // Act & Assert
      await expect(target.execute(dto, issuerUserId)).rejects.toThrow(
        'Due date must be in the future',
      );
      expect(invoiceRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when debtorUserId equals issuerUserId', async () => {
      // Arrange
      const dto = createValidDto();

      // Act & Assert
      await expect(target.execute(dto, debtorUserId)).rejects.toThrow(
        'Cannot send invoice to yourself',
      );
      expect(invoiceRepository.create).not.toHaveBeenCalled();
    });

    it('should normalize issueDate and dueDate to midnight', async () => {
      // Arrange
      const dto = createValidDto();
      invoiceRepository.create.mockImplementation((invoice) =>
        Promise.resolve({ ...invoice, id: 1 } as Invoice),
      );

      // Act
      await target.execute(dto, issuerUserId);

      // Assert
      const callArgs = invoiceRepository.create.mock.calls[0][0];
      const issueDate = callArgs.issueDate as Date;
      const dueDate = callArgs.dueDate as Date;
      expect(issueDate.getHours()).toBe(0);
      expect(issueDate.getMinutes()).toBe(0);
      expect(issueDate.getSeconds()).toBe(0);
      expect(issueDate.getMilliseconds()).toBe(0);
      expect(dueDate.getHours()).toBe(0);
      expect(dueDate.getMinutes()).toBe(0);
      expect(dueDate.getSeconds()).toBe(0);
      expect(dueDate.getMilliseconds()).toBe(0);
    });
  });
});
