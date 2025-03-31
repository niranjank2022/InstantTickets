import { IsNotEmpty, IsString } from 'class-validator';

export class signupDto {
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
