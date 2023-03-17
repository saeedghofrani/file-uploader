import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'src/config/configuration.module';
import { DatabaseService } from 'src/config/database/database.service';
import { MessageController } from './controller/message.controller';
import { MessageRepository } from './repository/message.repository';
import { MessageService } from './service/message.service';
@Module({
  imports: [ConfigurationModule],
  controllers: [MessageController],
  providers: [MessageRepository, MessageService, DatabaseService],
  exports: [MessageRepository, MessageService],
})
export class MessageModule {}
