"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesController = void 0;
const common_1 = require("@nestjs/common");
const movies_service_1 = require("./movies.service");
const message_response_dto_1 = require("./dto/message-response.dto");
const search_query_dto_1 = require("./dto/search-query.dto");
const favorites_query_dto_1 = require("./dto/favorites-query.dto");
const add_favorite_dto_1 = require("./dto/add-favorite.dto");
let MoviesController = class MoviesController {
    moviesService;
    constructor(moviesService) {
        this.moviesService = moviesService;
    }
    async searchMovies(queryDto) {
        const page = queryDto.page || 1;
        return await this.moviesService.getMovieByTitle(queryDto.q.trim(), page);
    }
    addToFavorites(movieToAdd) {
        const movieDto = {
            title: movieToAdd.title,
            imdbID: movieToAdd.imdbID,
            year: movieToAdd.year || 0,
            poster: movieToAdd.poster || '',
        };
        return this.moviesService.addToFavorites(movieDto);
    }
    removeFromFavorites(imdbID) {
        if (!imdbID || typeof imdbID !== 'string' || !imdbID.trim()) {
            throw new common_1.HttpException('imdbID parameter is required and cannot be empty', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.moviesService.removeFromFavorites(imdbID.trim());
    }
    async getFavorites(queryDto) {
        const page = queryDto.page || 1;
        return await this.moviesService.getFavorites(page);
    }
};
exports.MoviesController = MoviesController;
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_query_dto_1.SearchQueryDto]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "searchMovies", null);
__decorate([
    (0, common_1.Post)('favorites'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_favorite_dto_1.AddFavoriteDto]),
    __metadata("design:returntype", message_response_dto_1.MessageResponseDto)
], MoviesController.prototype, "addToFavorites", null);
__decorate([
    (0, common_1.Delete)('favorites/:imdbID'),
    __param(0, (0, common_1.Param)('imdbID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", message_response_dto_1.MessageResponseDto)
], MoviesController.prototype, "removeFromFavorites", null);
__decorate([
    (0, common_1.Get)('favorites/list'),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [favorites_query_dto_1.FavoritesQueryDto]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getFavorites", null);
exports.MoviesController = MoviesController = __decorate([
    (0, common_1.Controller)('movies'),
    __metadata("design:paramtypes", [movies_service_1.MoviesService])
], MoviesController);
//# sourceMappingURL=movies.controller.js.map