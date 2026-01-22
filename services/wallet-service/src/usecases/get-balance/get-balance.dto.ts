import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetBalanceDto {
  @ApiProperty({ example: 'a1b2c3d4-...' })
  @IsUUID()
  authId: string;
}

export class GetBalanceResponseDto {
  id: string;
  authId: string;
  currency: string;
  balanceCents: number;
  updatedAt: string;
}
