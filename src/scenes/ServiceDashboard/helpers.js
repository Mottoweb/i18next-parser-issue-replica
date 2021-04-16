import Colors from 'src/theme/Colors';

export const getTagColor = (color) => {
  if (color === 'red') {
    return Colors['adnz-danger'];
  }
  if (color === 'yellow') {
    return Colors['adnz-warning'];
  }
  return Colors['adnz-green'];
};
