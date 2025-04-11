import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Roles } from '../config/enum';

export class SignupDto {
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @IsString({ message: 'Password must be a string.' })
  password!: string;

  @IsNotEmpty({ message: 'Role is required.' })
  @IsEnum(Roles, {
    message: `Role must be one of the following: ${Object.values(Roles).join(', ')}`,
  })
  role!: Roles;
}
