import { IsNumber } from 'class-validator';

export class CreateOddsDto {
  @IsNumber()
  value: number;
}
