import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto): Promise<{ accessToken: string }> {
    const { email, password, role, fullName, address, phoneNumber } = createAuthDto;

    // Проверяем, существует ли пользователь
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('User already created');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      role,
      fullName,
      address,
      phoneNumber,
    });

    await this.usersRepository.save(user);

    // Создаем JWT-токен
    const payload = { id: user.id, email: user.email, role: user.role };

    console.log("\n role is " + payload.role)
    const accessToken = this.jwtService.sign(payload);
    const decodedToken = this.jwtService.decode(accessToken);
    console.log("\n Generated JWT payload:", decodedToken);
  
    return { accessToken };
  }

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Wrong email or password');
    }

    // Создаем JWT-токен
    const payload = { id: user.id, email: user.email, role: user.role };
    console.log("\n role is " + payload.role)
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
