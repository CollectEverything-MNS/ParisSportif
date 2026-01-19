import { Auth } from '../entities/auth.entity';

export abstract class IAuthRepository {
  abstract save(auth: Auth): Promise<Auth>;
  abstract findByEmail(email: string): Promise<Auth | null>;
  abstract findById(id: string): Promise<Auth | null>;
}
