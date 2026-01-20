import { IsString } from 'class-validator';

export class SoftDeleteDto {
  @IsString()
  authId: string;
}
