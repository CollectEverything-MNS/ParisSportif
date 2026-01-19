import { ConfigService } from '@nestjs/config';

export const serviceUrl = (config: ConfigService) => ({
  user: `http://${config.get('USER_SERVICE_HOST')}:${config.get('USER_SERVICE_PORT')}`,
  auth: `http://${config.get('AUTH_SERVICE_HOST')}:${config.get('AUTH_SERVICE_PORT')}`,
  match: `http://${config.get('MATCH_SERVICE_HOST')}:${config.get('MATCH_SERVICE_PORT')}`,
});
