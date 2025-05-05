import { IsNotEmpty, IsArray, IsString, ArrayNotEmpty, IsEmail } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty({ message: 'Email is required.' })
  @IsString({ message: 'Email must be a string.' })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email!: string;

  @IsNotEmpty({ message: 'Show ID is required.' })
  @IsString({ message: 'Show ID must be a string.' })
  showId!: string;

  @IsArray({ message: 'Booked seats must be an array.' })
  @ArrayNotEmpty({ message: 'At least one seat must be booked.' })
  @IsString({ each: true, message: 'Each seat must be a string.' })
  @IsNotEmpty({ each: true, message: 'Seat ID cannot be empty.' })
  bookedSeats!: string[];
}
