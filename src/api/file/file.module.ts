import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'src/config/configuration.module';
import { DatabaseService } from 'src/config/database/database.service';
import { FileController } from './controller/file.controller';
import { FilesRepository } from './repository/file.repository';
import { FilesService } from './service/file.service';
@Module({
  imports: [ConfigurationModule],
  controllers: [FileController],
  providers: [FilesRepository, FilesService, DatabaseService],
  exports: [FilesRepository, FilesService],
})
export class FileModule {}
