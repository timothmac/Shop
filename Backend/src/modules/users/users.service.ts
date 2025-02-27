import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Пользователь с id ${id} не найден`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<{ user: User; accessToken: string }> {
    await this.usersRepository.update(id, updateUserDto);
    const user = await this.findOne(id);
    console.log("User data:", user);
    const payload = { id: user.id, email: user.email, role: user.role };
    console.log("\n role is " + payload.role);
    const accessToken = this.jwtService.sign(payload);
    console.log(accessToken)
    return {  accessToken,user };
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
