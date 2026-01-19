import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  token: string;
}

export class RefreshTokenResponseDto {
  token: string;
  expiredAt: Date;
}
