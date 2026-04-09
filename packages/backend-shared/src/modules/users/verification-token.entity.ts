import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from './user.entity';

@Entity({ name: 'verification_tokens' })
export class VerificationToken extends BaseEntity {
  @Column({ type: 'uuid' })
  userId!: string;

  @Index('UQ_verification_tokens_token', { unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  token!: string;

  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  usedAt!: Date | null;

  @ManyToOne(() => User, (user) => user.verificationTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
