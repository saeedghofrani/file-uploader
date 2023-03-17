import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { WinstonModule, WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Logger } from '@nestjs/common';
import { AppModule } from "./app.module";
import { ResponseOkInterceptor } from "./common/interceptors/global-response.interceptor";
import { AppConfigService } from "./config/app/app-config.service";
import { logger } from "./config/logger/logger.class";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(logger.config),
  });
  const appService = <AppConfigService>app.get(AppConfigService);
  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix(appService.appApiPrefix);
  app.useGlobalInterceptors(new ResponseOkInterceptor());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const appConfigService = app.get<AppConfigService>(AppConfigService);
  const port = appConfigService.appPort || 4000;
  app.setGlobalPrefix(appConfigService.appApiPrefix);
  const config = new DocumentBuilder()
    .setTitle('file Apis')
    .setDescription('The file API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  Logger.log(`Swagger Is Enable In DEVELOPMENT Mode`, 'Swagger');
  await app.listen(port).then(async () => {
    Logger.log(`Running`, 'Swagger');
    Logger.log(
      `http://127.0.0.1:${port}`,
      'Running Server',
    );
    Logger.log(
      `http://127.0.0.1:${port}/api`,
      'Running Swagger',
    );
  });

}
bootstrap();
