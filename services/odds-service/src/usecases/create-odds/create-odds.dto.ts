import { IsNumber } from 'class-validator';

export class CreateOddsDto {
  @IsNumber()
  value: number;
}

export class CreateOddsResponseDto {
  id: string;
  value: number;
  createdAt: Date;
}
