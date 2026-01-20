import bcrypt from 'bcrypt';

export const hashPassword = (password: string): string => {
  return bcrypt.hash(password, 12);
};
