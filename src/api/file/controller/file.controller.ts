import { Controller, Get, HttpStatus, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FilesService } from '../service/file.service';
import { Response } from 'express';

@ApiTags('File')
@Controller('files')
export class FileController {

  constructor(
    private filesService: FilesService
  ) { }

  @Post('upload')
  @ApiOperation({ summary: 'Upload File' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './assets',
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 30, // 5MB
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.filesService.createFiles(file)
  }

  @Post('table')
  @ApiOperation({ summary: 'create files table if not exist' })
  async createFilesTable() {
    await this.filesService.createFilesTable();
  }

  @Get('unseen')
  @ApiOperation({ summary: 'get all unseen files' })
  async findUnseenFiles(
  ) {
    return await this.filesService.findUnseenFiles();
  }

  @ApiResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
    status: HttpStatus.OK,
  })
  @Get('buffer')
  @ApiOperation({ summary: 'download file simple way by buffer' })
  async buffer(
    @Res() response: Response,
    @Query("id") id: string
  ) {
    const file = await this.filesService.imageBuffer(id, response);
    response.send(file);
  }

  @Get('stream')
  @ApiOperation({ summary: 'download file using stream files' })
  async stream(
    @Res() response: Response,
    @Query("id") id: string
  ) {
    const file = await this.filesService.imageStream(id, response);
    file.pipe(response);
  }

  @Get('multiple')
  async download(@Res() response: Response) {
    return await this.filesService.donloadUnseenFiles(response)
  }
}