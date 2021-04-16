import {
  PERCENT_FORMATTER,
  NUMBER_FORMATTER,
} from 'src/constants';

export const formatText = (d) => {
  if (d.param === 'ctr') {
    return PERCENT_FORMATTER(d.value / 100);
  }
  return NUMBER_FORMATTER(d.value);
};
