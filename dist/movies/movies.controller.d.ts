import { MoviesService } from './movies.service';
import { SearchMoviesResponseDto } from './dto/search-response.dto';
import { FavoritesResponseDto } from './dto/favorites-response.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { SearchQueryDto } from './dto/search-query.dto';
import { FavoritesQueryDto } from './dto/favorites-query.dto';
import { AddFavoriteDto } from './dto/add-favorite.dto';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    searchMovies(queryDto: SearchQueryDto): Promise<SearchMoviesResponseDto>;
    addToFavorites(movieToAdd: AddFavoriteDto): MessageResponseDto;
    removeFromFavorites(imdbID: string): MessageResponseDto;
    getFavorites(queryDto: FavoritesQueryDto): Promise<FavoritesResponseDto>;
}
