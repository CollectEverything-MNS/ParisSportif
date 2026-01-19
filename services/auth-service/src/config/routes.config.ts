export const authRoutes = {
  root: `/auth`,
  auth: {
    login: `/login`,
    register: `/register`,
    logout: `/logout`,
    changePassword: `/change-password`,
    forgetPassword: {
      request: `/forget-password-request`,
      confirm: `/forget-password-confirm`,
    },
    refreshToken: `/refresh-token`,
    revokeToken: `/revoke-token`,
  }
};