import { ApiProperty } from "@nestjs/swagger";

export class InvoiceResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the invoice',
    example: '1',
  })
  id: number;

  @ApiProperty({
    description: 'The amount of the invoice',
    example: 100,
  })
  amount: number;

  @ApiProperty({
    description: 'The status of the invoice',
    example: 'PENDING',
  })
  status: string;

  @ApiProperty({
    description: 'The date the invoice was created',
    example: '2021-01-01',
  })
  createdAt: Date;
  
}   