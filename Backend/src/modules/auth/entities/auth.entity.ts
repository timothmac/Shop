// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
// import { User } from '../../users/entities/user.entity';

// @Entity()
// export class Auth {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @ManyToOne(() => User, (user) => user.authSessions, { onDelete: 'CASCADE' })
//   user: User;

//   @Column({ unique: true })
//   refreshToken: string;

//   @Column()
//   userAgent: string;

//   @Column()
//   ipAddress: string;

//   @CreateDateColumn()
//   createdAt: Date;
// }

