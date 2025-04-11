import { IsNotEmpty, IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty({ message: 'User ID is required.' })
  @IsString({ message: 'User ID must be a string.' })
  userId!: string;

  @IsNotEmpty({ message: 'Show ID is required.' })
  @IsString({ message: 'Show ID must be a string.' })
  showId!: string;

  @IsNotEmpty({ message: 'Venue ID is required.' })
  @IsString({ message: 'Venue ID must be a string.' })
  venueId!: string;

  @IsArray({ message: 'Booked seats must be an array.' })
  @ArrayNotEmpty({ message: 'At least one seat must be booked.' })
  @IsString({ each: true, message: 'Each seat must be a string.' })
  @IsNotEmpty({ each: true, message: 'Seat ID cannot be empty.' })
  bookedSeats!: string[];
}
