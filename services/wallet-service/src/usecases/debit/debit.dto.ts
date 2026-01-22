import { IsInt, IsPositive, IsString, Length } from 'class-validator';

export class DebitDto {
  @IsString()
  @Length(1, 128)
  betId: string;

  @IsString()
  @Length(1, 64)
  authId: string;

  @IsInt()
  @IsPositive()
  stakeCents: number;
}
