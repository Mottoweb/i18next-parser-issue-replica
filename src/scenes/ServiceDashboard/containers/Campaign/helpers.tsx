import {
  PERCENT_FORMATTER,
  NUMBER_FORMATTER,
} from 'src/constants';

export const formatText = (d:{ kind: string, value: number }): string | number => {
  if (d.kind === 'percents') {
    return PERCENT_FORMATTER(d.value / 100);
  }
  return NUMBER_FORMATTER(d.value);
};
