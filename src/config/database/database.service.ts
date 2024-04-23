import { createConnection } from 'mysql2/promise';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {

    constructor(private configService: ConfigService) {}

    async getConnection() {
        const connection = await createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: '09211953839',
            database: 'uploader',
            port: 3306,
        });
        return connection;
    }
}