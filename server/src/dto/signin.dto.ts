import { IsNotEmpty, IsString } from 'class-validator';

export class signinDto {
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
