import { IsEmail } from 'class-validator';

export class ForgetPasswordRequestDto {
  @IsEmail()
  email: string;
}
