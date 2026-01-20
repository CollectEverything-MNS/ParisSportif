const authBasePath = '/auth';
const matchsBasePath = '/matchs';
const calendarBasePath = '/calendar';
const oddsBasePath = '/odds';

export const routesConfig = {
  auth: {
    root: authBasePath,
    login: {
      path: `${authBasePath}/login`,
      link: (serviceUrl: string) => `${serviceUrl}${authBasePath}/login`,
    },
    register: {
      path: `${authBasePath}/register`,
      link: (serviceUrl: string) => `${serviceUrl}${authBasePath}/register`,
    },
    changePassword: {
      path: `${authBasePath}/change-password`,
      link: (serviceUrl: string) => `${serviceUrl}${authBasePath}/change-password`,
    },
    forgetPasswordRequest: {
      path: `${authBasePath}/forget-password-request`,
      link: (serviceUrl: string) => `${serviceUrl}${authBasePath}/forget-password-request`,
    },
    forgetPasswordConfirm: {
      path: `${authBasePath}/forget-password-confirm`,
      link: (serviceUrl: string) => `${serviceUrl}${authBasePath}/forget-password-confirm`,
    },
    token: {
      revoke: {
        path: `${authBasePath}/revoke-token`,
        link: (serviceUrl: string) => `${serviceUrl}${authBasePath}/revoke-token`,
      },
      refresh: {
        path: `${authBasePath}/refresh-token`,
        link: (serviceUrl: string) => `${serviceUrl}${authBasePath}/refresh-token`,
      },
    },
  },
  calendar: {
    root: calendarBasePath,
  },
  match: {
    root: {
      path: matchsBasePath,
      link: (serviceUrl: string) => `${serviceUrl}${matchsBasePath}`,
    },
  },
  odds: {
    root: oddsBasePath,
    create: {
      path: `${oddsBasePath}`,
      link: (serviceUrl: string) => `${serviceUrl}${oddsBasePath}`,
    },
  },
};
