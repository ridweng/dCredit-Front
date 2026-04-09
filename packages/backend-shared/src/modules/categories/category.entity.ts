import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { CategoryType } from '../../common/enums/category-type.enum';
import { Transaction } from '../transactions/transaction.entity';

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
  @Index('UQ_categories_key', { unique: true })
  @Column({ type: 'varchar', length: 100, unique: true })
  key!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
    enumName: 'category_type_enum',
  })
  type!: CategoryType;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions!: Transaction[];
}
