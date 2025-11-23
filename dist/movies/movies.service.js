"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MoviesService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const movies_constants_1 = require("./constants/movies.constants");
const omdb_service_1 = require("./services/omdb.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let MoviesService = MoviesService_1 = class MoviesService {
    configService;
    omdbService;
    logger = new common_1.Logger(MoviesService_1.name);
    favorites = [];
    favoritesLastModified = 0;
    favoritesFilePath;
    constructor(configService, omdbService) {
        this.configService = configService;
        this.omdbService = omdbService;
        const dataDir = path.join(process.cwd(), movies_constants_1.MOVIES_CONSTANTS.DATA_DIRECTORY);
        this.favoritesFilePath = path.join(dataDir, movies_constants_1.MOVIES_CONSTANTS.FAVORITES_FILE_NAME);
        this.loadFavorites();
    }
    loadFavorites() {
        try {
            if (fs.existsSync(this.favoritesFilePath)) {
                const fileStats = fs.statSync(this.favoritesFilePath);
                if (fileStats.mtimeMs > this.favoritesLastModified) {
                    const fileContent = fs.readFileSync(this.favoritesFilePath, 'utf-8');
                    this.favorites = JSON.parse(fileContent);
                    this.favoritesLastModified = fileStats.mtimeMs;
                }
            }
            else {
                this.ensureDataDirectoryExists();
                this.favorites = [];
                this.favoritesLastModified = Date.now();
            }
        }
        catch (error) {
            this.logger.error('Error loading favorites', error);
            this.favorites = [];
        }
    }
    getFavoritesList() {
        this.loadFavorites();
        return this.favorites;
    }
    ensureDataDirectoryExists() {
        const dataDir = path.dirname(this.favoritesFilePath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
    }
    saveFavorites() {
        try {
            this.ensureDataDirectoryExists();
            fs.writeFileSync(this.favoritesFilePath, JSON.stringify(this.favorites, null, 2));
            this.favoritesLastModified = Date.now();
        }
        catch (error) {
            this.logger.error('Error saving favorites', error);
            throw new common_1.HttpException('Failed to save favorites', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMovieByTitle(title, page = movies_constants_1.MOVIES_CONSTANTS.DEFAULT_PAGE) {
        try {
            const response = await this.omdbService.searchMovies(title, page);
            const favorites = this.getFavoritesList();
            const favoritesMap = new Map(favorites.map(fav => [fav.imdbID.toLowerCase(), fav]));
            const formattedResponse = response.movies.map((movie) => {
                const isFavorite = favoritesMap.has(movie.imdbID.toLowerCase());
                return {
                    title: movie.Title,
                    imdbID: movie.imdbID,
                    year: this.parseYear(movie.Year),
                    poster: movie.Poster,
                    isFavorite,
                };
            });
            return {
                data: {
                    movies: formattedResponse,
                    count: formattedResponse.length,
                    totalResults: response.totalResults,
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Error getting movies by title', error);
            throw new common_1.HttpException('Failed to get movies by title', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    parseYear(yearString) {
        if (!yearString)
            return 0;
        const match = yearString.match(/^\d{4}/);
        return match ? parseInt(match[0], 10) : 0;
    }
    addToFavorites(movieToAdd) {
        if (!movieToAdd || typeof movieToAdd !== 'object') {
            throw new common_1.HttpException('Movie data is required', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!movieToAdd.imdbID || !movieToAdd.title) {
            throw new common_1.HttpException('Movie must have imdbID and title', common_1.HttpStatus.BAD_REQUEST);
        }
        const favorites = this.getFavoritesList();
        const foundMovie = favorites.some((movie) => movie.imdbID.toLowerCase() === movieToAdd.imdbID.toLowerCase());
        if (foundMovie) {
            throw new common_1.HttpException('Movie already in favorites', common_1.HttpStatus.BAD_REQUEST);
        }
        const validatedMovie = {
            title: movieToAdd.title,
            imdbID: movieToAdd.imdbID,
            year: movieToAdd.year || 0,
            poster: movieToAdd.poster || '',
        };
        this.favorites.push(validatedMovie);
        this.saveFavorites();
        return {
            data: {
                message: 'Movie added to favorites',
            },
        };
    }
    removeFromFavorites(movieId) {
        if (!movieId || typeof movieId !== 'string' || !movieId.trim()) {
            throw new common_1.HttpException('Movie ID is required', common_1.HttpStatus.BAD_REQUEST);
        }
        const favorites = this.getFavoritesList();
        const foundIndex = favorites.findIndex((movie) => movie.imdbID.toLowerCase() === movieId.toLowerCase());
        if (foundIndex === -1) {
            throw new common_1.HttpException('Movie not found in favorites', common_1.HttpStatus.NOT_FOUND);
        }
        this.favorites.splice(foundIndex, 1);
        this.saveFavorites();
        return {
            data: {
                message: 'Movie removed from favorites',
            },
        };
    }
    getFavorites(page = movies_constants_1.MOVIES_CONSTANTS.DEFAULT_PAGE, pageSize = movies_constants_1.MOVIES_CONSTANTS.DEFAULT_PAGE_SIZE) {
        const favorites = this.getFavoritesList();
        if (favorites.length === 0) {
            return {
                data: {
                    favorites: [],
                    count: 0,
                    totalResults: '0',
                    currentPage: page,
                    totalPages: 0,
                },
            };
        }
        if (!Number.isInteger(page) || page < movies_constants_1.MOVIES_CONSTANTS.MIN_PAGE) {
            throw new common_1.HttpException('Page must be a positive integer', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!Number.isInteger(pageSize) || pageSize < movies_constants_1.MOVIES_CONSTANTS.MIN_PAGE_SIZE) {
            throw new common_1.HttpException('Page size must be a positive integer', common_1.HttpStatus.BAD_REQUEST);
        }
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedFavorites = favorites.slice(startIndex, endIndex);
        return {
            data: {
                favorites: paginatedFavorites,
                count: paginatedFavorites.length,
                totalResults: String(favorites.length),
                currentPage: page,
                totalPages: Math.ceil(favorites.length / pageSize),
            },
        };
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = MoviesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, omdb_service_1.OmdbService])
], MoviesService);
//# sourceMappingURL=movies.service.js.map