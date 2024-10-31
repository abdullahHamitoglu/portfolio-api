import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsObject,
} from 'class-validator';
import { LocaleKeys } from 'src/types';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsObject()
  title: { [key in LocaleKeys]: string };

  @IsOptional()
  @IsObject()
  description: { [key in LocaleKeys]?: string };

  @IsOptional()
  @IsString()
  background: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  @IsBoolean()
  featured: boolean;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  category: string;
}
