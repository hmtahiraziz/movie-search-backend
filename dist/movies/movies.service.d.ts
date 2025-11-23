import { ConfigService } from '@nestjs/config';
import { MovieDto } from './dto/movie.dto';
import { SearchMoviesResponseDto } from './dto/search-response.dto';
import { FavoritesResponseDto } from './dto/favorites-response.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { OmdbService } from './services/omdb.service';
export declare class MoviesService {
    private configService;
    private omdbService;
    private readonly logger;
    private favorites;
    private favoritesLastModified;
    private readonly favoritesFilePath;
    constructor(configService: ConfigService, omdbService: OmdbService);
    private loadFavorites;
    private getFavoritesList;
    private ensureDataDirectoryExists;
    private saveFavorites;
    getMovieByTitle(title: string, page?: number): Promise<SearchMoviesResponseDto>;
    private parseYear;
    addToFavorites(movieToAdd: MovieDto): MessageResponseDto;
    removeFromFavorites(movieId: string): MessageResponseDto;
    getFavorites(page?: number, pageSize?: number): FavoritesResponseDto;
}
