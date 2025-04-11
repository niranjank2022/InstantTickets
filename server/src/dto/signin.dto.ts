import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Roles } from '../config/enum';

export class SigninDto {
  @IsNotEmpty({ message: 'Email is required.' })
  @IsString({ message: 'Email must be a string.' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @IsString({ message: 'Password must be a string.' })
  password!: string;

  @IsNotEmpty({ message: 'Role is required.' })
  @IsEnum(Roles, { message: `Role must be one of the following: ${Object.values(Roles).join(', ')}` })
  role!: Roles;
}
