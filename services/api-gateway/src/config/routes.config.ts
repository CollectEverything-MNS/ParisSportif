const authBasePath = '/auth';
const matchsBasePath = '/matchs';
const calendarBasePath = '/calendar';
const oddsBasePath = '/odds';
const usersBasePath = '/users';
const walletBasePath = '/wallet';

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

  user: {
    createUser: {
      path: `${usersBasePath}/create-user`,
      link: (serviceUrl: string) => `${serviceUrl}${usersBasePath}/create-user`,
    },

    getUser: {
      path: `${usersBasePath}/get-user/:id`,
      link: (serviceUrl: string, id: string) => `${serviceUrl}/users/${id}`,
    },

    getUsers: {
      path: `${usersBasePath}`,
      link: (serviceUrl: string) => `${serviceUrl}${usersBasePath}`,
    },

    updateUser: {
      path: `${usersBasePath}/update-user/:id`,
      link: (serviceUrl: string, id: string) => `${serviceUrl}/users/${id}`,
    },

    deleteUser: {
      path: `${usersBasePath}/delete-user/:id`,
      link: (serviceUrl: string, id: string) => `${serviceUrl}/users/${id}`,
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
  wallet: {
    root: walletBasePath,
    balance: {
      path: `${walletBasePath}/balance`,
      link: (serviceUrl: string) => `${serviceUrl}${walletBasePath}/balance`,
    },
    deposit: {
      path: `${walletBasePath}/deposit`,
      link: (serviceUrl: string) => `${serviceUrl}${walletBasePath}/deposit`,
    },
    withdraw: {
      path: `${walletBasePath}/withdraw`,
      link: (serviceUrl: string) => `${serviceUrl}${walletBasePath}/withdraw`,
    },
    transactions: {
      path: `${walletBasePath}/transactions`,
      link: (serviceUrl: string) => `${serviceUrl}${walletBasePath}/transactions`,
    },
  },
};
