import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // замените на ваш секретный ключ
    });
  }

  async validate(payload: any) {
    // Возвращаем объект, который будет доступен как request.user
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
