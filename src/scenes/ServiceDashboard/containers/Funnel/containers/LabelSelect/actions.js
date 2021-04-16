import {
  createAction,
} from 'redux-actions';
import { getTags } from '@adnz/api-ws-funnel';
import * as actionTypes from './actionTypes';

export const select = (item, save = false) => createAction(actionTypes.CHOOSE)({
  item,
  save,
});

export const getOptions = (token, nameFilter) => getTags({
  sort: 'name',
  order: 'ASC',
  type: 'SALESFUNNEL',
  nameFilter,
  limit: 500,
}, token).then(
  ({ data }) => data.items.map((item) => ({
    label: item.name,
    value: item.id,
  })),
);
