import bcrypt from 'bcrypt';

export const hashPassword = (password: string): string => {
  return bcrypt.hash(password, 12);
};

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
