import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  mode: process.env.APP_MODE,
  name: process.env.APP_NAME,
  port: process.env.APP_PORT,
  api_prefix: process.env.API_GLOBAL_PREFIX,
}));
