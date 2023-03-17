import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from 'src/common/helper/env.helper';
import { AppConfigService } from './app/app-config.service';
import appConfiguration from './app/app-configuration';
import { DatabaseService } from './database/database.service';
import { LoggerModule } from './logger/logger.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvPath(),
      cache: true,
      load: [
        appConfiguration,
      ],
    }),
    LoggerModule
  ],
  providers: [AppConfigService, DatabaseService],
  exports: [AppConfigService, DatabaseService],
})
export class ConfigurationModule {}
