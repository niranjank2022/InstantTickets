import { IsNotEmpty, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShowDto {
  @IsNotEmpty({ message: 'Movie ID is required' })
  @IsString({ message: 'Movie ID must be a string' })
  movieId!: string;

  @IsNotEmpty({ message: 'Venue ID is required' })
  @IsString({ message: 'Venue ID must be a string' })
  venueId!: string;

  @IsNotEmpty({ message: 'Movie title is required' })
  @IsString({ message: 'Movie title must be a string' })
  movieTitle!: string;

  @IsNotEmpty({ message: 'Format is required' })
  @IsString({ message: 'Format must be a string' })
  format!: string;

  @IsNotEmpty({ message: 'Language is required' })
  @IsString({ message: 'Language must be a string' })
  language!: string;

  @IsNotEmpty({ message: 'Start time is required' })
  @IsDate({ message: 'Start time must be a valid date' })
  @Type(() => Date)
  startTime!: Date;

  @IsNotEmpty({ message: 'End time is required' })
  @IsDate({ message: 'End time must be a valid date' })
  @Type(() => Date)
  endTime!: Date;
}
