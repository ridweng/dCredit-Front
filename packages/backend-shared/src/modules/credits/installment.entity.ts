import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { InstallmentStatus } from '../../common/enums/installment-status.enum';
import { numericTransformer } from '../../common/transformers/numeric.transformer';
import { Credit } from './credit.entity';

@Entity({ name: 'installments' })
@Index('UQ_installments_credit_installment_number', ['creditId', 'installmentNumber'], {
  unique: true,
})
export class Installment extends BaseEntity {
  @Column({ type: 'uuid' })
  creditId!: string;

  @Column({ type: 'int' })
  installmentNumber!: number;

  @Column({ type: 'date' })
  dueDate!: string;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  amount!: number;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  principalPortion!: number | null;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  interestPortion!: number | null;

  @Column({
    type: 'enum',
    enum: InstallmentStatus,
    enumName: 'installment_status_enum',
    default: InstallmentStatus.PENDING,
  })
  status!: InstallmentStatus;

  @ManyToOne(() => Credit, (credit) => credit.installments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creditId' })
  credit!: Credit;
}
