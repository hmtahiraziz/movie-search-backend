"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    const corsOrigins = configService.get('CORS_ORIGINS')
        ? configService.get('CORS_ORIGINS').split(',').map(origin => origin.trim())
        : ['http://localhost:3000'];
    app.enableCors({
        origin: corsOrigins,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    const port = configService.get('PORT') || 3001;
    try {
        await app.listen(port);
        logger.log(`Application is running on: ${await app.getUrl()}`);
    }
    catch (error) {
        logger.error('Error starting application', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map