import { IsNumber } from 'class-validator';

export class UpdateOddsDto {
  @IsNumber()
  value: number;
}

export class UpdateOddsResponseDto {
  id: string;
  value: number;
  updatedAt: Date;
}
