import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export enum RoleType {
  OWNER = 'OWNER',
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export class CreateUserDto {
  @ApiProperty({ example: 'user@mail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Seynabou' })
  @IsString()
  @Length(2, 50)
  firstName: string;

  @ApiProperty({ example: 'Ba' })
  @IsString()
  @Length(2, 50)
  lastName: string;

  @ApiPropertyOptional({ example: '+33612345678' })
  @IsOptional()
  @IsString()
  @Length(6, 20)

  @Matches(/^\+?[0-9\s-]{6,20}$/, { message: 'phone invalide' })
  phone?: string;

  @ApiPropertyOptional({ example: '10 rue de la Paix' })
  @IsOptional()
  @IsString()
  @Length(2, 120)
  address?: string;

  @ApiPropertyOptional({ example: '57000' })
  @IsOptional()
  @IsString()
  @Length(2, 12)
  postaleCode?: string;

  @ApiPropertyOptional({ example: 'Metz' })
  @IsOptional()
  @IsString()
  @Length(2, 60)
  city?: string;

  @ApiPropertyOptional({ example: 'France' })
  @IsOptional()
  @IsString()
  @Length(2, 60)
  country?: string;

  @ApiProperty({
    example: ['CUSTOMER'],
    enum: RoleType,
    isArray: true,
    description: 'Au moins 1 rôle',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(RoleType, { each: true })
  role: RoleType[];
}
