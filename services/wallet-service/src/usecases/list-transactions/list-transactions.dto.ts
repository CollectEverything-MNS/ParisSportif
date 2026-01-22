import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class ListTransactionsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class ListTransactionResponseDto {
  id: string;
  type: 'DEPOSIT'|'WITHDRAW'|'BET'|'WIN';
  amountCents: number;
  createdAt: string;
}
