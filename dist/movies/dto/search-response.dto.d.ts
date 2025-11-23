import { MovieDto } from './movie.dto';
export declare class SearchMoviesResponseDto {
    data: {
        movies: MovieDto[];
        count: number;
        totalResults: string;
    };
}
