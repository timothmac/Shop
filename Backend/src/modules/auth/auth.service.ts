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

  async register(createAuthDto: CreateAuthDto): Promise<{ user:any , accessToken: string }> {
    const { email, password, role, fullName, address, phoneNumber } = createAuthDto;
  
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('User already created');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      role: role || 'client', 
      fullName,
      address,
      phoneNumber,
    });
  
    await this.usersRepository.save(user);
  
    const payload = { id: user.id, email: user.email, role: user.role };
  
    const accessToken = this.jwtService.sign(payload);
    return { user, accessToken };
  }

  async login(email: string, password: string): Promise<{ user:any ,accessToken: string }> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Wrong email or password');
    }


    const payload = { id: user.id, email: user.email, role: user.role };
    console.log("\n role is " + payload.role)
    const accessToken = this.jwtService.sign(payload);

    return { user, accessToken };
  }
}
