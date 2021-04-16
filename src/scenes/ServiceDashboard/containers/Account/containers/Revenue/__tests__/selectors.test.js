/* global throwFunctionFactory */
import MockDate from 'mockdate';
import {
  fromJS,
} from 'immutable';
import * as selectors from '../selectors';

describe('getDataset', () => {
  it('should throw an error \'Cannot find account\'', () => {
    expect(throwFunctionFactory(selectors.getDataset, fromJS({}), { itemId: '1' })).toThrowError('Cannot find account');
  });

  it('should return dataset', () => {
    MockDate.set('2006-01-01T00:00:00Z');

    const account = fromJS({
      thisYearNet2: 50,
      lastYearNet2: 40,
      beforeLastYearNet2: 30,
    });
    const result = fromJS([{
      name: '2004',
      value: 30,
    }, {
      name: '2005',
      value: 40,
    }, {
      name: '2006',
      value: 50,
    }]);

    expect(selectors.getDataset.resultFunc(account)).toEqual(result);
  });
});
