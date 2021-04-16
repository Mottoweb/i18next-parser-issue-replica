import {
  createAction,
} from 'redux-actions';
import { getContacts } from '@adnz/api-ws-salesforce';
import * as actionTypes from './actionTypes';

export const select = (item) => createAction(actionTypes.CHOOSE)({
  item,
});

export const getOptions = (token, filter) => getContacts({
  sort: 'name',
  order: 'ASC',
  filter,
  limit: 20,
}, token).then(
  ({ data }) => data.items.map((item) => ({
    label: item.name,
    value: item.id,
  })),
);
