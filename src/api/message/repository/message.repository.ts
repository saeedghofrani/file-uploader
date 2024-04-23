import { Injectable } from '@nestjs/common/decorators';
import { DatabaseService } from 'src/config/database/database.service';
import { Files } from 'src/db-classes/file.class';
import { Message } from 'src/db-classes/message.class';

@Injectable()
export class MessageRepository {
    constructor(
        private databaseService: DatabaseService
    ) {
    }

    async createMessageTable(): Promise<void> {
        const connection = await this.databaseService.getConnection();
        const sql = `
          CREATE TABLE IF NOT EXISTS message (
            id CHAR(36) NOT NULL PRIMARY KEY,
            message VARCHAR(255) NOT NULL,
            created_at DATETIME NOT NULL,
            delete_at DATETIME
          )
        `;
        await connection.query(sql);
    }

    async create(message: Message): Promise<Message> {
        const connection = await this.databaseService.getConnection();
        const sql = `INSERT INTO message (id, message, created_at)
                  VALUES (?, ?, ?)`;
        const [result] = await connection.query(sql, [
            message.id,
            message.message,
            message.created_at
        ]);
        return message;
    }

    async findById(id: string): Promise<Message | undefined> {
        const connection = await this.databaseService.getConnection();
        const sql = `SELECT * FROM message WHERE id = ?`;
        const [rows] = await connection.query(sql, [id]);
        return rows[0] as Message | undefined;
    }

    async findAll(): Promise<Message[]> {
        const connection = await this.databaseService.getConnection();
        const sql = `SELECT * FROM message`;
        const [rows] = await connection.query(sql);
        return rows as Message[];
    }

    async findUnseenMessages(): Promise<Message[]> {
        const connection = await this.databaseService.getConnection();
        const sql = `SELECT * FROM message as m WHERE m.delete_at IS NULL`;
        const [rows] = await connection.query(sql);

        return rows as Message[];
    }

    async setDeleteAt(id: string[]) {
        let conditions = `id = '${id[0]}'`;
        for (let i = 1; i < id.length; i++) {
            const element = id[i];
            conditions += ` OR id = '${id[i]}'`;
        }
        const connection = await this.databaseService.getConnection();
        const sql = `
        UPDATE message SET delete_at = NOW() WHERE ${conditions}`;
        const [rows] = await connection.query(sql);
        return rows as Files[];
    }
}