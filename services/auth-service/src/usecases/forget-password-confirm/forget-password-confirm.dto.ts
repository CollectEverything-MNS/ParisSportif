import { IsEmail, IsString } from 'class-validator';

export class ForgetPasswordConfirmDto {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;

  @IsString()
  newPassword: string;
}
