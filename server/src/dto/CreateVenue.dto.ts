import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ISection } from '../models/venue.model';
import { Type } from 'class-transformer';
import { SectionDto } from './Section.dto';

export class CreateVenueDto {
  @IsNotEmpty({ message: 'Venue name is required.' })
  @IsString({ message: 'Venue name must be a string.' })
  name!: string;

  @IsNotEmpty({ message: 'City is required.' })
  @IsString({ message: 'City must be a string.' })
  city!: string;

  @IsNotEmpty({ message: 'Number of rows is required.' })
  @IsNumber({}, { message: 'Rows must be a valid number.' })
  @Type(() => Number)
  rows!: number;

  @IsNotEmpty({ message: 'Number of columns is required.' })
  @IsNumber({}, { message: 'Columns must be a valid number.' })
  @Type(() => Number)
  columns!: number;

  @IsArray({ message: 'Sections must be an array.' })
  @ArrayNotEmpty({ message: 'At least one section must be provided.' })
  @ValidateNested({ each: true, message: 'Each section must be a valid object.' })
  @Type(() => SectionDto)
  sections!: ISection[];
}
