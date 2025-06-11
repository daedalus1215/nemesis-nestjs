import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
    maxLength: 20,
  })
  username: string;

  @ApiProperty({
    description: 'The current balance of the user',
    example: 1000,
    minimum: 0,
  })
  balance: number;
}
