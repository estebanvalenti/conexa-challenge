import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema()
export class Movie {
  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  episode_id: number;

  @Prop({
    required: true,
  })
  opening_crawl: string;

  @Prop({
    required: true,
  })
  director: string;

  @Prop({
    required: true,
  })
  producer: string;

  @Prop()
  release_date: Date;

  @Prop()
  characters: string[];

  @Prop()
  planets: string[];

  @Prop()
  starships: string[];

  @Prop()
  vehicles: string[];

  @Prop()
  species: string[];

  @Prop()
  created: Date;

  @Prop()
  edited: Date;

  @Prop()
  url: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
