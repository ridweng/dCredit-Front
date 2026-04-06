import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { CreditType } from '../../common/enums/credit-type.enum';
import { numericTransformer } from '../../common/transformers/numeric.transformer';
import { User } from '../users/user.entity';
import { FinancialSource } from '../financial-sources/financial-source.entity';
import { Installment } from './installment.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity({ name: 'credits' })
@Index('IDX_credits_user_financial_source_name', ['userId', 'financialSourceId', 'name'], {
  unique: true,
})
export class Credit extends BaseEntity {
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid' })
  financialSourceId!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({
    type: 'enum',
    enum: CreditType,
    enumName: 'credit_type_enum',
  })
  creditType!: CreditType;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  originalAmount!: number;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  outstandingBalance!: number;

  @Column({
    type: 'numeric',
    precision: 5,
    scale: 2,
    transformer: numericTransformer,
  })
  interestRate!: number;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  monthlyPayment!: number;

  @Column({ type: 'date' })
  nextPaymentDate!: string;

  @Column({ type: 'date', nullable: true })
  deferredPaymentDate!: string | null;

  @Column({ type: 'int', nullable: true })
  totalInstallments!: number | null;

  @Column({ type: 'int', nullable: true })
  remainingInstallments!: number | null;

  @ManyToOne(() => User, (user) => user.credits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => FinancialSource, (financialSource) => financialSource.credits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'financialSourceId' })
  financialSource!: FinancialSource;

  @OneToMany(() => Installment, (installment) => installment.credit)
  installments!: Installment[];

  @OneToMany(() => Transaction, (transaction) => transaction.credit)
  transactions!: Transaction[];
}
