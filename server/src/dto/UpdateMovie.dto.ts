import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateMovieDto {
  @IsNotEmpty({ message: 'Title must not be empty' })
  @IsString({ message: 'Title must be a string' })
  title!: string;

  @IsNotEmpty({ message: 'Image URL must not be empty' })
  @IsString({ message: 'Image URL must be a string' })
  img!: string;

  @IsArray({ message: 'Languages must be an array' })
  @ArrayNotEmpty({ message: 'Languages must not be empty' })
  @ArrayMinSize(1, { message: 'At least one language is required' })
  @IsString({ each: true, message: 'Each language must be a string' })
  @IsNotEmpty({ each: true, message: 'Languages must not contain empty values' })
  languages!: string[];

  @IsArray({ message: 'Formats must be an array' })
  @ArrayNotEmpty({ message: 'Formats must not be empty' })
  @ArrayMinSize(1, { message: 'At least one format is required' })
  @IsString({ each: true, message: 'Each format must be a string' })
  @IsNotEmpty({ each: true, message: 'Formats must not contain empty values' })
  formats!: string[];

  @IsArray({ message: 'Genres must be an array' })
  @ArrayNotEmpty({ message: 'Genres must not be empty' })
  @ArrayMinSize(1, { message: 'At least one genre is required' })
  @IsString({ each: true, message: 'Each genre must be a string' })
  @IsNotEmpty({ each: true, message: 'Genres must not contain empty values' })
  genres!: string[];

  @IsArray({ message: 'Cities must be an array' })
  @IsString({ each: true, message: 'Each city must be a string' })
  cities!: string[];
}
