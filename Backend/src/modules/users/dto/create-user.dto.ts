import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
  MANAGER = 'manager'
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole, { message: 'Role must be either admin, client, or manager' })
  role: UserRole;
}
