import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  authId: string;

  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}