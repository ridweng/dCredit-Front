import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { activationStages } from '../admin.types';

function toOptionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (value === 'true' || value === true) {
    return true;
  }

  if (value === 'false' || value === false) {
    return false;
  }

  return undefined;
}

function toOptionalInt(value: unknown, fallback: number): number {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export class SearchUsersQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @Transform(({ value }) => toOptionalBoolean(value))
  @IsBoolean()
  verified?: boolean;

  @IsOptional()
  @Transform(({ value }) => toOptionalBoolean(value))
  @IsBoolean()
  hasCredits?: boolean;

  @IsOptional()
  @Transform(({ value }) => toOptionalBoolean(value))
  @IsBoolean()
  hasFinancialSources?: boolean;

  @IsOptional()
  @IsIn(activationStages)
  activationStage?: (typeof activationStages)[number];

  @Transform(({ value }) => toOptionalInt(value, 1))
  @IsInt()
  @Min(1)
  page = 1;

  @Transform(({ value }) => toOptionalInt(value, 20))
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 20;
}
