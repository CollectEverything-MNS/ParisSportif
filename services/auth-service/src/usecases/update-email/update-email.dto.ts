import { IsEmail, IsString } from 'class-validator';

export class UpdateEmailDto {
  @IsString()
  authId: string;

  @IsEmail()
  newEmail: string;
}
