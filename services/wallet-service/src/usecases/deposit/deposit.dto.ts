import { IsInt, IsPositive, IsUUID } from 'class-validator';

export class DepositDto {
  @IsUUID()
  authId: string;

  @IsInt()
  @IsPositive()
  amountCents: number;
}
