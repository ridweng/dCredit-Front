import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { PreferredLanguage } from '../../common/enums/preferred-language.enum';
import { VerificationToken } from './verification-token.entity';
import { FinancialSource } from '../financial-sources/financial-source.entity';
import { Account } from '../accounts/account.entity';
import { Credit } from '../credits/credit.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Index('UQ_users_email', { unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 255 })
  fullName!: string;

  @Column({ type: 'boolean', default: false })
  emailVerified!: boolean;

  @Column({
    type: 'enum',
    enum: PreferredLanguage,
    enumName: 'preferred_language_enum',
    default: PreferredLanguage.EN,
  })
  preferredLanguage!: PreferredLanguage;

  @OneToMany(() => VerificationToken, (token) => token.user)
  verificationTokens!: VerificationToken[];

  @OneToMany(() => FinancialSource, (financialSource) => financialSource.user)
  financialSources!: FinancialSource[];

  @OneToMany(() => Account, (account) => account.user)
  accounts!: Account[];

  @OneToMany(() => Credit, (credit) => credit.user)
  credits!: Credit[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions!: Transaction[];
}
