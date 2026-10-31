import type { InterAuthService } from './InterAuthService';

export class AuthServiceHttp implements InterAuthService {
  async login(correo: string): Promise<string> {
    return (await fetch('/login?correo=' + correo)).text();
  }
}
