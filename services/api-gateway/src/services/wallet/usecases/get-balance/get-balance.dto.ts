import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetBalanceDto {
  @ApiProperty({ example: 'a1b2c3d4-...' })
  @IsUUID()
  authId: string;
}
