import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgetPasswordConfirmDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: '123456' })
  otp: string;

  @IsString()
  @ApiProperty({ example: 'motdepasse' })
  newPassword: string;
}
