import { ConfigService } from '@nestjs/config';

export type ServiceUrls = {
  user: string;
  auth: string;
  calendar: string;
  match: string;
  odds: string;
};

export const serviceUrl = (config: ConfigService): ServiceUrls => ({
  user: `http://${config.get('USER_SERVICE_HOST')}:${config.get('USER_SERVICE_PORT')}`,
  auth: `http://${config.get('AUTH_SERVICE_HOST')}:${config.get('AUTH_SERVICE_PORT')}`,
  calendar: `http://${config.get('CALENDAR_SERVICE_HOST')}:${config.get('CALENDAR_SERVICE_PORT')}`,
  match: `http://${config.get('MATCH_SERVICE_HOST')}:${config.get('MATCH_SERVICE_PORT')}`,
  odds: `http://${config.get('ODDS_SERVICE_HOST')}:${config.get('ODDS_SERVICE_PORT')}`,
});
