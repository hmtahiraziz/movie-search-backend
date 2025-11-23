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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var OmdbService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmdbService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const movies_constants_1 = require("../constants/movies.constants");
const axios_1 = __importDefault(require("axios"));
let OmdbService = OmdbService_1 = class OmdbService {
    configService;
    logger = new common_1.Logger(OmdbService_1.name);
    baseUrl;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('OMDB_API_KEY');
        if (!apiKey) {
            throw new Error('OMDB_API_KEY environment variable is required');
        }
        const baseUrl = this.configService.get('OMDB_API_BASE_URL') || movies_constants_1.MOVIES_CONSTANTS.OMDB_API_BASE_URL;
        this.baseUrl = `${baseUrl}?apikey=${apiKey}`;
    }
    async searchMovies(title, page = movies_constants_1.MOVIES_CONSTANTS.DEFAULT_PAGE) {
        if (!title || typeof title !== 'string' || !title.trim()) {
            throw new common_1.HttpException('Title is required', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!Number.isInteger(page) || page < movies_constants_1.MOVIES_CONSTANTS.MIN_PAGE) {
            throw new common_1.HttpException('Page must be a positive integer', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const response = await axios_1.default.get(`${this.baseUrl}&s=${encodeURIComponent(title)}&plot=full&page=${page}`);
            if (response.data.Response === 'False' || response.data.Error) {
                return { movies: [], totalResults: '0' };
            }
            return {
                movies: response.data.Search || [],
                totalResults: response.data.totalResults || '0'
            };
        }
        catch (error) {
            this.logger.error('Error searching movies from OMDb API', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to search movies from OMDb API', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.OmdbService = OmdbService;
exports.OmdbService = OmdbService = OmdbService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], OmdbService);
//# sourceMappingURL=omdb.service.js.map