import { ConfigService } from '@nestjs/config';
import { OmdbMovie } from '../dto/omdb-response.dto';
export declare class OmdbService {
    private configService;
    private readonly logger;
    private readonly baseUrl;
    constructor(configService: ConfigService);
    searchMovies(title: string, page?: number): Promise<{
        movies: OmdbMovie[];
        totalResults: string;
    }>;
}
