import { MessageEntity } from '../chat/message.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './enums/role.enum';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  currentHashedRefreshToken?: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  public role: Role;

  @OneToMany(() => MessageEntity, (message) => message.author)
  message?: MessageEntity[];
}
