import { IsNotEmpty, IsArray, IsString, ArrayNotEmpty, ArrayMinSize } from 'class-validator';

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
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  bookedSeats!: string[];
}
