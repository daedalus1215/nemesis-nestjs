import { Controller, Get } from '@nestjs/common';
import { AuthUser, GetAuthUser } from 'src/auth/app/decorators/get-auth-user.decorator';
import { ProtectedAction } from 'src/shared/application/protected-action-options';
import { InvoiceResponseDto } from './invoice.response.dto';

@Controller('invoices')
export class FetchUserBalanceAction {
  constructor() {}

  @Get('pending')
  @ProtectedAction({
    tag: 'Invoice',
    summary: 'Get pending invoices by user id',
  })
  async handle(@GetAuthUser() user: AuthUser): Promise<InvoiceResponseDto> {
    return {
      id: 1,
      amount: 100,
      status: 'PENDING',
      createdAt: new Date(),
    }
  }
}