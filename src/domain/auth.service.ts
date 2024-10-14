import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class AuthService {
  constructor(private readonly passportService: PassportStrategy) {}

  async validate(token: string): Promise<any> {
    try {
      const decoded = await this.passportService.authenticate(
        'jwt',
        { req: null, res: null },
        token,
      );
      return decoded;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async login(user: any): Promise<{ accessToken: string }> {
    const payload = { ...user };
    const accessToken = this.passportService.generateToken(payload);
    return { accessToken };
  }
}
