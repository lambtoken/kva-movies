import { Injectable } from '@angular/core';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class RandomMovieGenerator {
  private movieTitles = [
    'Paradoks kvantuma', 'Ponoćni odjeci', 'Snovi među zvezdama', 'Noći u neonu', 'Poslednja granica',
    'Šapat tame', 'Iza horizonta', 'Tiha oluja', 'Večni plamen', 'Čovek iz senke',
    'Izgubljeno carstvo', 'Uskrsnuće feniksa', 'Skrivena istina', 'Srce okeana', 'Zov planine',
    'Zaboravljeni grad', 'Putnik kroz vreme', 'Tajna bašta', 'Noćni jahač', 'Zlatni put',
    'Polomljeno ogledalo', 'Poslednji ples', 'Skrivena dolina', 'Tiha reka', 'Izgubljena zvezda',
    'Drevni svitak', 'Mistična šuma', 'Kristalna pećina', 'Pustinjska ruža', 'Zimska bajka'
  ];

  private movieDescriptions = [
    'Napeta avantura koja vodi do samih granica stvarnosti – i dalje od njih.',
    'Epsko putovanje kroz vreme i prostor koje menja sve što si mislio da znaš.',
    'Misteriozna priča o ljubavi, izdaji i iskupljenju u neobičnom svetu.',
    'Kad se prošlost i budućnost sudare, samo jedna osoba može spasiti sadašnjost.',
    'U svetu gde je magija stvarna, junak mora skupiti hrabrost da prihvati svoju sudbinu.',
    'Topla priča o prijateljstvu, hrabrosti i veri u sebe.',
    'Akcioni triler koji te neće pustiti da odahneš.',
    'Dirljiva drama o porodici, ljubavi i vezama koje nas čine onim što jesmo.',
    'Naučnofantastična avantura koja pomera granice ljudske mašte.',
    'Romantična komedija koja dokazuje da ljubav stiže kada je najmanje očekuješ.',
    'Horor koji tera da se zapitaš šta je stvarnost, a šta plod tvoje mašte.',
    'Potresna drama o ljudskoj snazi i nadi koja ne gasne.',
    'Velika avantura koja vodi u najudaljenije delove poznatog svemira.',
    'Misterija koja drži u neizvesnosti sve do poslednjeg trenutka.',
    'Priča o borbi za opstanak u najtežim mogućim uslovima.'
  ];

  private directors = [
    'Christopher Nolan', 'Quentin Tarantino', 'Steven Spielberg', 'James Cameron', 'Peter Jackson',
    'Ridley Scott', 'Martin Scorsese', 'Alfred Hitchcock', 'Stanley Kubrick', 'Francis Ford Coppola',
    'George Lucas', 'Tim Burton', 'Wes Anderson', 'David Fincher', 'Denis Villeneuve',
    'Damien Chazelle', 'Greta Gerwig', 'Jordan Peele', 'Bong Joon-ho', 'Alfonso Cuarón',
    'Guillermo del Toro', 'Darren Aronofsky', 'Paul Thomas Anderson', 'Coen Brothers', 'Wachowski Sisters'
  ];

  private actors = [
    'Tom Hanks', 'Meryl Streep', 'Leonardo DiCaprio', 'Scarlett Johansson', 'Brad Pitt',
    'Angelina Jolie', 'Johnny Depp', 'Emma Stone', 'Ryan Gosling', 'Jennifer Lawrence',
    'Denzel Washington', 'Sandra Bullock', 'Will Smith', 'Charlize Theron', 'Matt Damon',
    'Julia Roberts', 'George Clooney', 'Nicole Kidman', 'Hugh Jackman', 'Anne Hathaway',
    'Robert Downey Jr.', 'Chris Evans', 'Chris Hemsworth', 'Mark Ruffalo', 'Jeremy Renner',
    'Scarlett Johansson', 'Elizabeth Olsen', 'Benedict Cumberbatch', 'Tom Holland', 'Zendaya'
  ];

  private genres = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Adventure',
    'Fantasy', 'Mystery', 'Crime', 'Animation', 'Documentary', 'War', 'Western', 'Musical'
  ];

  private coverImageUrl = 'https://i.pinimg.com/736x/da/2c/d3/da2cd3ad3c311d1db8d42819c9f49b04.jpg';

  constructor() { }

  public generateRandomMovies(count: number = 20): Movie[] {
    const movies: Movie[] = [];
    
    for (let i = 0; i < count; i++) {
      movies.push(this.generateRandomMovie(i.toString()));
    }
    
    return movies;
  }

  private generateRandomMovie(id: string): Movie {
    const randomTitle = this.getRandomElement(this.movieTitles);
    const randomDescription = this.getRandomElement(this.movieDescriptions);
    const randomDirector = this.getRandomElement(this.directors);
    
    const genreCount = Math.floor(Math.random() * 3) + 1;
    const randomGenres = this.getRandomElements(this.genres, genreCount);
    
    const actorCount = Math.floor(Math.random() * 3) + 2;
    const randomActors = this.getRandomElements(this.actors, actorCount);
    
    const randomDate = this.generateRandomDate();
    
    return {
      id: id,
      title: randomTitle,
      description: randomDescription,
      releaseDate: randomDate,
      genres: randomGenres,
      director: randomDirector,
      actors: randomActors,
      imageUrl: this.coverImageUrl
    };
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private generateRandomDate(): Date {
    const now = new Date();
    const fiveYearsAgo = new Date(now.getFullYear() - 5, 0, 1);
    const timeDiff = now.getTime() - fiveYearsAgo.getTime();
    const randomTime = fiveYearsAgo.getTime() + Math.random() * timeDiff;
    return new Date(randomTime);
  }
} 