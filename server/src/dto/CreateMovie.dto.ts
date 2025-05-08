import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty({ message: 'Movie title is required.' })
  @IsString({ message: 'Movie title must be a string.' })
  title!: string;

  @IsNotEmpty({ message: 'Movie image URL is required.' })
  @IsString({ message: 'Movie image URL must be a string.' })
  img!: string;

  @IsArray({ message: 'Languages must be an array.' })
  @ArrayNotEmpty({ message: 'At least one language must be specified.' })
  @ArrayMinSize(1, { message: 'There must be at least one language.' })
  @IsString({ each: true, message: 'Each language must be a string.' })
  @IsNotEmpty({ each: true, message: 'Language cannot be empty.' })
  languages!: string[];

  @IsArray({ message: 'Formats must be an array.' })
  @ArrayNotEmpty({ message: 'At least one format must be specified.' })
  @ArrayMinSize(1, { message: 'There must be at least one format.' })
  @IsString({ each: true, message: 'Each format must be a string.' })
  @IsNotEmpty({ each: true, message: 'Format cannot be empty.' })
  formats!: string[];

  @IsArray({ message: 'Genres must be an array.' })
  @ArrayNotEmpty({ message: 'At least one genre must be specified.' })
  @ArrayMinSize(1, { message: 'There must be at least one genre.' })
  @IsString({ each: true, message: 'Each genre must be a string.' })
  @IsNotEmpty({ each: true, message: 'Genre cannot be empty.' })
  genres!: string[];

  @IsArray({ message: 'Cities must be an array.' })
  @ArrayNotEmpty({ message: 'At least one city must be specified.' })
  @ArrayMinSize(1, { message: 'There must be at least one city.' })
  @IsString({ each: true, message: 'Each city must be a string.' })
  @IsNotEmpty({ each: true, message: 'City name cannot be empty.' })
  cities!: string[];
}
