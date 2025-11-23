import { MovieDto } from './movie.dto';
export declare class FavoritesResponseDto {
    data: {
        favorites: MovieDto[];
        count: number;
        totalResults: string;
        currentPage: number;
        totalPages: number;
    };
}
