import { Module } from '@nestjs/common';
import { FileModule } from './api/file/file.module';
import { MessageModule } from './api/message/message.module';
import { ConfigurationModule } from './config/configuration.module';

@Module({
  imports: [FileModule, ConfigurationModule, MessageModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
