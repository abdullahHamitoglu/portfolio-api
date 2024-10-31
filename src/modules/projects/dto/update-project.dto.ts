import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { LocaleKeys } from 'src/types';

export class UpdateProjectDto {
  @IsOptional()
  @IsObject()
  title?: { [key in LocaleKeys]: string };

  @IsOptional()
  @IsObject()
  description?: { [key in LocaleKeys]?: string };

  @IsOptional()
  @IsString()
  background?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
