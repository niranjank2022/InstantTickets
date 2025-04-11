import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SectionDto {
  @IsNotEmpty({ message: 'Section name is required.' })
  @IsString({ message: 'Section name must be a string.' })
  name!: string;

  @IsNotEmpty({ message: 'Number of rows is required.' })
  @IsNumber({}, { message: 'Rows must be a valid number.' })
  @Type(() => Number)
  rows!: number;

  @IsNotEmpty({ message: 'Number of columns is required.' })
  @IsNumber({}, { message: 'Columns must be a valid number.' })
  @Type(() => Number)
  columns!: number;

  @IsNotEmpty({ message: 'X position is required.' })
  @IsNumber({}, { message: 'X must be a valid number.' })
  @Type(() => Number)
  x!: number;

  @IsNotEmpty({ message: 'Y position is required.' })
  @IsNumber({}, { message: 'Y must be a valid number.' })
  @Type(() => Number)
  y!: number;

  @IsNotEmpty({ message: 'Price is required.' })
  @IsNumber({}, { message: 'Price must be a valid number.' })
  @Type(() => Number)
  price!: number;

  @IsNotEmpty({ message: 'Color is required.' })
  @IsString({ message: 'Color must be a string.' })
  color!: string;
}
