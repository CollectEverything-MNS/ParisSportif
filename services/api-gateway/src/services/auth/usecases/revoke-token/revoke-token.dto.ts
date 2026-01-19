import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RevokeTokenDto {
  @ApiProperty({ example: 'abc123...' })
  @IsString()
  token: string;
}
