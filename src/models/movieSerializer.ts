import { Movie } from './movie'

export class MovieSerializer {
  static serialize(movie: Movie): any {
    return {
      ...movie,
      releaseDate: movie.releaseDate.toISOString()
    };
  }

  static deserialize(data: any): Movie {
    return {
      ...data,
      releaseDate: new Date(data.releaseDate)
    };
  }
}