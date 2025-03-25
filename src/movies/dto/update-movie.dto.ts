import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';

export class UpdateMovieParamsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  episode_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  opening_crawl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  director: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  producer: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  release_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  created?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  edited?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  url?: string;
}
