import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { TransactionType } from '../../common/enums/transaction-type.enum';
import { numericTransformer } from '../../common/transformers/numeric.transformer';
import { User } from '../users/user.entity';
import { Account } from '../accounts/account.entity';
import { Credit } from '../credits/credit.entity';
import { Category } from '../categories/category.entity';

@Entity({ name: 'transactions' })
@Index('IDX_transactions_user_date', ['userId', 'date'])
@Index('IDX_transactions_account_date', ['accountId', 'date'])
export class Transaction extends BaseEntity {
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid' })
  accountId!: string;

  @Column({ type: 'uuid', nullable: true })
  creditId!: string | null;

  @Column({ type: 'uuid', nullable: true })
  categoryId!: string | null;

  @Column({ type: 'timestamptz' })
  date!: Date;

  @Column({ type: 'varchar', length: 255 })
  description!: string;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  amount!: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
    enumName: 'transaction_type_enum',
  })
  type!: TransactionType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  merchant!: string | null;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Account, (account) => account.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account!: Account;

  @ManyToOne(() => Credit, (credit) => credit.transactions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'creditId' })
  credit!: Credit | null;

  @ManyToOne(() => Category, (category) => category.transactions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category!: Category | null;
}
