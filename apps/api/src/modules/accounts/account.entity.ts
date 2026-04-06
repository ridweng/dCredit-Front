import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { AccountType } from '../../common/enums/account-type.enum';
import { numericTransformer } from '../../common/transformers/numeric.transformer';
import { User } from '../users/user.entity';
import { FinancialSource } from '../financial-sources/financial-source.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity({ name: 'accounts' })
@Index('IDX_accounts_user_financial_source_name', ['userId', 'financialSourceId', 'accountName'], {
  unique: true,
})
export class Account extends BaseEntity {
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid' })
  financialSourceId!: string;

  @Column({ type: 'varchar', length: 255 })
  accountName!: string;

  @Column({
    type: 'enum',
    enum: AccountType,
    enumName: 'account_type_enum',
  })
  accountType!: AccountType;

  @Column({ type: 'varchar', length: 3 })
  currency!: string;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  currentBalance!: number;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  availableBalance!: number | null;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => FinancialSource, (financialSource) => financialSource.accounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'financialSourceId' })
  financialSource!: FinancialSource;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions!: Transaction[];
}
