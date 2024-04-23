import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
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
        text: {
          type: 'string',
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
        callback(null, true);
      }
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('text') text: string) {
    return await this.filesService.createFiles(file, text)
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
  @Get('buffer/:id')
  @ApiOperation({ summary: 'download file simple way by buffer' })
  async buffer(
    @Res() response: Response,
    @Param("id") id: string
  ) {
    console.log(id);
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