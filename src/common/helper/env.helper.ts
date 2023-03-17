import { resolve } from 'path';

export function getEnvPath(): string {
  const prefix = './src/common/envs';
  const env: string | undefined = process.env.APP_MODE;
  const filename: string = env
    ? `${prefix}${env}.env`
    : prefix + '/development.env';
  return resolve(`${filename}`);
}
