import { IsInt, IsPositive, IsUUID } from 'class-validator';

export class WithdrawDto {
  @IsUUID()
  authId: string;

  @IsInt()
  @IsPositive()
  amountCents: number;
}
