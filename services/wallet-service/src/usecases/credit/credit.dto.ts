import { IsInt, IsPositive, IsIn, IsOptional, ValidateIf, IsUUID } from 'class-validator';

export class CreditDto {
  @IsUUID()
  betId: string;

  @IsUUID()
  authId: string;

  @IsIn(['WIN', 'LOSS'])
  outcome: 'WIN' | 'LOSS';

  @IsOptional()
  @IsInt()
  @IsPositive()
  @ValidateIf((o) => o.outcome === 'WIN')
  winCents?: number;
}
