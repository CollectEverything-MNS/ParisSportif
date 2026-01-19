import { IsString } from 'class-validator';

export class RevokeTokenDto {
  @IsString()
  token: string;
}
