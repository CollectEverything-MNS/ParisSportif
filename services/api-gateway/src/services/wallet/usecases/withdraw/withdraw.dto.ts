import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsUUID } from 'class-validator';

export class WithdrawDto {
  @ApiProperty({ example: 'a1b2c3d4-...' })
  @IsUUID()
  authId: string;

  @ApiProperty({ example: '500' })
  @IsInt()
  @IsPositive()
  amountCents: number;
}
