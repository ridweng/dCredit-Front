import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { FinancialSourceStatus } from '../../common/enums/financial-source-status.enum';
import { ProviderType } from '../../common/enums/provider-type.enum';
import { User } from '../users/user.entity';
import { Account } from '../accounts/account.entity';
import { Credit } from '../credits/credit.entity';

@Entity({ name: 'financial_sources' })
@Index('IDX_financial_sources_user_provider', ['userId', 'providerName', 'providerType'], {
  unique: true,
})
export class FinancialSource extends BaseEntity {
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 150 })
  providerName!: string;

  @Column({
    type: 'enum',
    enum: ProviderType,
    enumName: 'provider_type_enum',
  })
  providerType!: ProviderType;

  @Column({
    type: 'enum',
    enum: FinancialSourceStatus,
    enumName: 'financial_source_status_enum',
    default: FinancialSourceStatus.PENDING,
  })
  status!: FinancialSourceStatus;

  @Column({ type: 'varchar', length: 255 })
  credentialReference!: string;

  @ManyToOne(() => User, (user) => user.financialSources, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => Account, (account) => account.financialSource)
  accounts!: Account[];

  @OneToMany(() => Credit, (credit) => credit.financialSource)
  credits!: Credit[];
}
