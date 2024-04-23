import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Files } from 'src/db-classes/file.class';
import { FilesRepository } from '../repository/file.repository';
import { readFile } from 'fs/promises';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import * as archiver from 'archiver';

@Injectable()
export class FilesService {
  constructor(private readonly fileRepository: FilesRepository) { }

  async createFiles(createFilesDto: Express.Multer.File, text: string): Promise<Files> {
    const files = new Files({
      created_at: new Date(Date.now()),
      file: createFilesDto.filename,
      file_path: createFilesDto.path,
      id: randomUUID(),
      mime_type: createFilesDto.mimetype,
      original: createFilesDto.originalname,
      size: createFilesDto.size,
      text
    });
    return await this.fileRepository.create(files, text);
  }

  async createFilesTable() {
    await this.fileRepository.createFilesTable()
  }

  async findAllFiles(): Promise<Files[]> {
    return await this.fileRepository.findAll();
  }

  async findFilesById(id: string): Promise<Files> {
    console.log(id);
    return await this.fileRepository.findById(id);
  }

  async findUnseenFiles() {
    const files = await this.fileRepository.findUnseenFiles();
    await this.setDeleteAt(files.map((item) => item.id));
    return files;
  }

  async donloadUnseenFiles(response: Response) {
    const files = await this.findUnseenFiles();
    return await this.downloadMultipleFiles(files.map((item) => item.file_path), response);
  }

  async setDeleteAt(id: string[]) {
    return await this.fileRepository.setDeleteAt(id);
  }

  async imageBuffer(id: string, response: Response) {
    console.log(id);
    const { file_path, original, mime_type } = await this.findFilesById(id);
    response.setHeader('Content-Disposition', `attachment; filename=${original}`);
    response.setHeader('Content-Type', `${mime_type}`);
    return await readFile(join(process.cwd(), file_path));
  }

  async imageStream(id: string, response: Response) {
    const { file_path, original, mime_type } = await this.findFilesById(id);
    response.setHeader('Content-Disposition', `attachment; filename=${original}`);
    response.setHeader('Content-Type', `${mime_type}`);
    return createReadStream(join(process.cwd(), file_path));
  }

  async downloadMultipleFiles(file_paths: string[], response: Response) {
    const fileNames = file_paths;
    const archive = archiver('zip');
    response.setHeader('Content-Disposition', 'attachment; filename=images.zip');
    response.setHeader('Content-Type', 'application/zip');
    archive.pipe(response);
    fileNames.forEach((fileName) => {
      const filePath = join(process.cwd(), fileName);
      archive.append(createReadStream(filePath), { name: fileName });
    });
    archive.finalize();
  }
}