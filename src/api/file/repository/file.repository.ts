import { Injectable } from '@nestjs/common/decorators';
import { DatabaseService } from 'src/config/database/database.service';
import { Files } from 'src/db-classes/file.class';

@Injectable()
export class FilesRepository {
    constructor(
        private databaseService: DatabaseService
    ) {
    }

    async createFilesTable(): Promise<void> {
        const connection = await this.databaseService.getConnection();
        const sql = `
          CREATE TABLE IF NOT EXISTS files (
            id CHAR(36) NOT NULL PRIMARY KEY,
            mime_type VARCHAR(255) NOT NULL,
            size int NOT NULL,
            file VARCHAR(255) NOT NULL,
            file_path VARCHAR(255) NOT NULL,
            original VARCHAR(255) NOT NULL,
            created_at DATETIME NOT NULL
            delete_at DATETIME
          )
        `;
        await connection.query(sql);
    }

    async create(file: Files): Promise<Files> {
        const connection = await this.databaseService.getConnection();
        const sql = `INSERT INTO files (id, mime_type, size, file, file_path, original, created_at) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await connection.query(sql, [
            file.id,
            file.mime_type,
            file.size,
            file.file,
            file.file_path,
            file.original,
            file.created_at
        ]);
        return file;
    }

    async findById(id: string): Promise<Files | undefined> {
        const connection = await this.databaseService.getConnection();
        const sql = `SELECT * FROM files WHERE id = ?`;
        const [rows] = await connection.query(sql, [id]);
        return rows[0] as Files | undefined;
    }

    async findAll(): Promise<Files[]> {
        const connection = await this.databaseService.getConnection();
        const sql = `SELECT * FROM files`;
        const [rows] = await connection.query(sql);
        return rows as Files[];
    }

    async findUnseenFiles(): Promise<Files[]> {
        const connection = await this.databaseService.getConnection();
        const sql = `SELECT * FROM files as fs WHERE fs.delete_at IS NULL`;
        const [rows] = await connection.query(sql);

        return rows as Files[];
    }

    async setDeleteAt(id: string[]) {
        let conditions = `id = '${id[0]}'`;
        for (let i = 1; i < id.length; i++) {
            const element = id[i];
            conditions += ` OR id = '${id[i]}'`;
        }
        const connection = await this.databaseService.getConnection();
        const sql = `
        UPDATE files SET delete_at = NOW() WHERE ${conditions}`;
        const [rows] = await connection.query(sql);
        return rows as Files[];
    }
}