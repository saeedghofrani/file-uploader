import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get appPort(): number {
    return parseInt(this.configService.get<string>('APP_PORT'));
  }

  get appEnv(): string {
    return this.configService.get<string>('APP_MODE');
  }

  get appApiPrefix(): string {
    return this.configService.get<string>('APP_API_PREFIX');
  }
}
