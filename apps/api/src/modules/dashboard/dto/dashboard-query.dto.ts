import { IsUUID } from 'class-validator';

export class DashboardQueryDto {
  @IsUUID()
  userId!: string;
}
