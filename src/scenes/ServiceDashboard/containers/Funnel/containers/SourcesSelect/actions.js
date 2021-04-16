import {
  createAction,
} from 'redux-actions';
import { getSources } from '@adnz/api-ws-funnel';
import * as actionTypes from './actionTypes';

export const select = (item, save = false) => createAction(actionTypes.CHOOSE)({
  item,
  save,
});

export const getOptions = (token, nameFilter) => getSources({
  sort: 'name',
  order: 'ASC',
  nameFilter,
}, token).then(
  ({ data }) => data.items.map((item) => ({
    label: item.name,
    value: item.id,
  })),
);
