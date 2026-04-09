export const numericTransformer = {
  to(value: number | null | undefined): number | null {
    if (value === undefined || value === null) {
      return null;
    }

    return value;
  },
  from(value: string | null | undefined): number | null {
    if (value === undefined || value === null) {
      return null;
    }

    return Number(value);
  },
};
