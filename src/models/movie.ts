export interface Movie {
  id: string;
  title: string;
  description: string;
  releaseDate: Date;
  genres: string[];
  director: string;
  actors: string[];
  imageUrl: string;
}