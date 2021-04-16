import createCachedSelector from 're-reselect';
import moment from 'moment';
import {
  fromJS,
} from 'immutable';
import {
  getItemId,
  getAccount,
} from 'src/selectors';

export const getDataset = createCachedSelector(
  getAccount,
  (account) => {
    if (account.size === 0) {
      throw new Error('Cannot find account');
    }

    const result = [{
      name: moment().format('YYYY'),
      value: account.get('thisYearNet2') || 0,
    }];

    if (account.get('lastYearNet2')) {
      result.unshift({
        name: moment().add(-1, 'years').format('YYYY'),
        value: account.get('lastYearNet2') || 0,
      });
    }

    if (account.get('beforeLastYearNet2')) {
      result.unshift({
        name: moment().add(-2, 'years').format('YYYY'),
        value: account.get('beforeLastYearNet2') || 0,
      });
    }

    return fromJS(result);
  },
)(getItemId);
