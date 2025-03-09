import { IsNotEmpty, IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class createBookingDto {
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  showId!: string;

  @IsNotEmpty()
  @IsString()
  venueId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  seats!: string[];
}
