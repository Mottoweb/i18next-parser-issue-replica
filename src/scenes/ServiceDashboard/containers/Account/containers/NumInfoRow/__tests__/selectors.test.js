import {
  fromJS,
} from 'immutable';

jest.mock('./../../../selectors', () => {});

const selectors = require('../selectors');

describe('getCount', () => {
  it('should return zero by default', () => {
    expect(selectors.getCount.resultFunc(fromJS({}))).toBe(0);
  });

  it('should return three', () => {
    const instance = 'INSTANCE';
    const state = fromJS({
      count: {
        [instance]: 3,
      },
    });
    expect(selectors.getCount.resultFunc(state, instance)).toBe(3);
  });
});

describe('isLoading', () => {
  it('should return false', () => {
    expect(selectors.isLoading.resultFunc(fromJS({}))).toBe(false);
  });

  it('should return true', () => {
    const instance = 'INSTANCE';
    const state = fromJS({
      loading: {
        [instance]: true,
      },
    });
    expect(selectors.isLoading.resultFunc(state, instance)).toBe(true);
  });
});
