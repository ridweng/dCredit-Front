import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type ColumnRow = {
  tableName: string;
  columnName: string;
  ordinalPosition: number;
  dataType: string;
  udtName: string;
  isNullable: 'YES' | 'NO';
  columnDefault: string | null;
  characterMaximumLength: number | null;
  numericPrecision: number | null;
  numericScale: number | null;
};

type ConstraintRow = {
  tableName: string;
  constraintName: string;
  constraintType: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE' | 'CHECK';
  columnName: string | null;
  foreignTableName: string | null;
  foreignColumnName: string | null;
  updateRule: string | null;
  deleteRule: string | null;
};

type TableStatsRow = {
  tableName: string;
  estimatedRows: string | number | null;
  totalBytes: string | number | null;
};

type IndexRow = {
  tableName: string;
  indexName: string;
  indexDefinition: string;
};

type Relationship = {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  constraintName: string;
  updateRule: string | null;
  deleteRule: string | null;
};

const TABLE_DOCUMENTATION: Record<string, { purpose: string; notes: string }> = {
  users: {
    purpose: 'Application identity, auth state, preferred language, and admin access.',
    notes:
      'Users are the anchor for authentication, activation analysis, dashboard readiness, and admin access.',
  },
  verification_tokens: {
    purpose: 'Email verification lifecycle with one-time token usage and expiry.',
    notes: 'Used for verification, resend flows, expiry enforcement, and operational verification timing.',
  },
  financial_sources: {
    purpose: 'Connected institutions or imported sources with secure credential references.',
    notes: 'Credential references point to a vault-style placeholder, not plaintext credentials.',
  },
  accounts: {
    purpose: 'Liquid or card accounts used for balance and transaction visibility.',
    notes: 'Supports consolidated liquid balance, per-source liquidity breakdowns, and spending attribution.',
  },
  transactions: {
    purpose: 'Normalized income, expense, and payment records for spending insights.',
    notes: 'Feeds weekly spending, category summaries, recent activity, and activation readiness.',
  },
  categories: {
    purpose: 'Lookup table for normalized transaction classification.',
    notes: 'Keeps spending categories stable for charts, percentages, and transaction insights.',
  },
  credits: {
    purpose: 'Credit products tracked for risk, monthly obligations, and payment planning.',
    notes: 'Supports high-interest alerts, payment planning, and timeline visualizations.',
  },
  installments: {
    purpose: 'Future or historical payment schedule for loans and installment products.',
    notes: 'Feeds the Gantt-like timeline in product experiences and internal credit review.',
  },
  typeorm_migrations: {
    purpose: 'Migration history written by TypeORM.',
    notes: 'Operational table used to track which schema migrations have already been applied.',
  },
};

@Injectable()
export class SchemaDocumentationService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getSchemaReference() {
    const [columnsResult, constraintsResult, tableStatsResult, indexesResult] =
      await Promise.all([
        this.dataSource.query(`
        SELECT
          c.table_name AS "tableName",
          c.column_name AS "columnName",
          c.ordinal_position AS "ordinalPosition",
          c.data_type AS "dataType",
          c.udt_name AS "udtName",
          c.is_nullable AS "isNullable",
          c.column_default AS "columnDefault",
          c.character_maximum_length AS "characterMaximumLength",
          c.numeric_precision AS "numericPrecision",
          c.numeric_scale AS "numericScale"
        FROM information_schema.columns c
        WHERE c.table_schema = 'public'
        ORDER BY c.table_name, c.ordinal_position
      `),
        this.dataSource.query(`
        SELECT
          tc.table_name AS "tableName",
          tc.constraint_name AS "constraintName",
          tc.constraint_type AS "constraintType",
          kcu.column_name AS "columnName",
          ccu.table_name AS "foreignTableName",
          ccu.column_name AS "foreignColumnName",
          rc.update_rule AS "updateRule",
          rc.delete_rule AS "deleteRule"
        FROM information_schema.table_constraints tc
        LEFT JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        LEFT JOIN information_schema.constraint_column_usage ccu
          ON tc.constraint_name = ccu.constraint_name
          AND tc.table_schema = ccu.table_schema
        LEFT JOIN information_schema.referential_constraints rc
          ON tc.constraint_name = rc.constraint_name
          AND tc.table_schema = rc.constraint_schema
        WHERE tc.table_schema = 'public'
        ORDER BY tc.table_name, tc.constraint_name, kcu.ordinal_position
      `),
        this.dataSource.query(`
        SELECT
          c.relname AS "tableName",
          COALESCE(s.n_live_tup, 0) AS "estimatedRows",
          pg_total_relation_size(c.oid) AS "totalBytes"
        FROM pg_class c
        INNER JOIN pg_namespace n
          ON n.oid = c.relnamespace
        LEFT JOIN pg_stat_user_tables s
          ON s.relid = c.oid
        WHERE n.nspname = 'public'
          AND c.relkind = 'r'
        ORDER BY c.relname
      `),
        this.dataSource.query(`
        SELECT
          tablename AS "tableName",
          indexname AS "indexName",
          indexdef AS "indexDefinition"
        FROM pg_indexes
        WHERE schemaname = 'public'
        ORDER BY tablename, indexname
      `),
      ]);

    const columns = columnsResult as ColumnRow[];
    const constraints = constraintsResult as ConstraintRow[];
    const tableStats = tableStatsResult as TableStatsRow[];
    const indexes = indexesResult as IndexRow[];

    const columnsByTable = new Map<string, ColumnRow[]>();
    const constraintsByTable = new Map<string, ConstraintRow[]>();
    const indexesByTable = new Map<string, IndexRow[]>();
    const statsByTable = new Map<string, { estimatedRows: number; totalBytes: number }>(
      tableStats.map((entry) => [
        entry.tableName,
        {
          estimatedRows: Number(entry.estimatedRows ?? 0),
          totalBytes: Number(entry.totalBytes ?? 0),
        },
      ]),
    );

    for (const column of columns) {
      const tableColumns = columnsByTable.get(column.tableName) ?? [];
      tableColumns.push(column);
      columnsByTable.set(column.tableName, tableColumns);
    }

    for (const constraint of constraints) {
      const tableConstraints = constraintsByTable.get(constraint.tableName) ?? [];
      tableConstraints.push(constraint);
      constraintsByTable.set(constraint.tableName, tableConstraints);
    }

    for (const index of indexes) {
      const tableIndexes = indexesByTable.get(index.tableName) ?? [];
      tableIndexes.push(index);
      indexesByTable.set(index.tableName, tableIndexes);
    }

    const tableNames = Array.from(
      new Set([
        ...columnsByTable.keys(),
        ...constraintsByTable.keys(),
        ...indexesByTable.keys(),
        ...statsByTable.keys(),
      ]),
    ).sort();

    const foreignKeyRelationships: Relationship[] = constraints
      .filter(
        (constraint) =>
          constraint.constraintType === 'FOREIGN KEY' &&
          constraint.columnName &&
          constraint.foreignTableName &&
          constraint.foreignColumnName,
      )
      .map((constraint) => ({
        fromTable: constraint.tableName,
        fromColumn: constraint.columnName as string,
        toTable: constraint.foreignTableName as string,
        toColumn: constraint.foreignColumnName as string,
        constraintName: constraint.constraintName,
        updateRule: constraint.updateRule,
        deleteRule: constraint.deleteRule,
      }));

    const tables = tableNames.map((tableName) => {
      const tableColumns = columnsByTable.get(tableName) ?? [];
      const tableConstraints = constraintsByTable.get(tableName) ?? [];
      const primaryKeyColumns = new Set(
        tableConstraints
          .filter(
            (constraint) =>
              constraint.constraintType === 'PRIMARY KEY' && constraint.columnName,
          )
          .map((constraint) => constraint.columnName as string),
      );
      const uniqueColumns = new Set(
        tableConstraints
          .filter(
            (constraint) => constraint.constraintType === 'UNIQUE' && constraint.columnName,
          )
          .map((constraint) => constraint.columnName as string),
      );
      const foreignKeys = foreignKeyRelationships.filter(
        (relationship) => relationship.fromTable === tableName,
      );
      const foreignKeysByColumn = new Map(
        foreignKeys.map((relationship) => [relationship.fromColumn, relationship]),
      );
      const incomingForeignKeys = foreignKeyRelationships.filter(
        (relationship) => relationship.toTable === tableName,
      );
      const tableDoc = TABLE_DOCUMENTATION[tableName] ?? {
        purpose: 'Live table discovered from the connected Postgres schema.',
        notes:
          'This table is not yet documented in the static domain notes, but it is included automatically from the database metadata.',
      };
      const stats = statsByTable.get(tableName) ?? {
        estimatedRows: 0,
        totalBytes: 0,
      };

      return {
        name: tableName,
        purpose: tableDoc.purpose,
        notes: tableDoc.notes,
        estimatedRows: stats.estimatedRows,
        totalBytes: stats.totalBytes,
        totalSizeLabel: this.formatBytes(stats.totalBytes),
        primaryKeys: Array.from(primaryKeyColumns),
        foreignKeys,
        incomingForeignKeys,
        indexes: (indexesByTable.get(tableName) ?? []).map((index) => ({
          name: index.indexName,
          definition: index.indexDefinition,
        })),
        columns: tableColumns.map((column) => {
          const foreignKey = foreignKeysByColumn.get(column.columnName);
          return {
            name: column.columnName,
            dataType: this.formatColumnType(column),
            nullable: column.isNullable === 'YES',
            defaultValue: column.columnDefault,
            isPrimaryKey: primaryKeyColumns.has(column.columnName),
            isForeignKey: Boolean(foreignKey),
            isUnique: uniqueColumns.has(column.columnName),
            references: foreignKey
              ? {
                  table: foreignKey.toTable,
                  column: foreignKey.toColumn,
                  updateRule: foreignKey.updateRule,
                  deleteRule: foreignKey.deleteRule,
                }
              : null,
          };
        }),
        relatedTables: Array.from(
          new Set([
            ...foreignKeys.map((relationship) => relationship.toTable),
            ...incomingForeignKeys.map((relationship) => relationship.fromTable),
          ]),
        ).sort(),
      };
    });

    return {
      generatedAt: new Date().toISOString(),
      source: 'postgres_information_schema',
      overview: {
        summary:
          'Live schema reference generated from the connected Postgres database. The explorer combines database metadata with lightweight domain notes for the core dCredit tables.',
        tableCount: tables.length,
        relationshipCount: foreignKeyRelationships.length,
        relationships: foreignKeyRelationships.map((relationship) => ({
          label: `${relationship.fromTable}.${relationship.fromColumn} -> ${relationship.toTable}.${relationship.toColumn}`,
          ...relationship,
        })),
      },
      tables,
    };
  }

  private formatColumnType(column: ColumnRow): string {
    if (column.dataType === 'USER-DEFINED') {
      return `enum (${column.udtName})`;
    }

    if (column.characterMaximumLength) {
      return `${column.dataType}(${column.characterMaximumLength})`;
    }

    if (column.numericPrecision) {
      return column.numericScale !== null
        ? `${column.dataType}(${column.numericPrecision}, ${column.numericScale})`
        : `${column.dataType}(${column.numericPrecision})`;
    }

    return column.dataType;
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    const units = ['KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let unitIndex = -1;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }

    return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
  }
}
