import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { handleActions } from 'redux-actions';
import * as companySwitchActionTypes from 'src/modules/CompaniesSwitch/actionTypes';
import * as accessActionTypes from 'src/modules/Access/actionTypes';
import * as actionTypes from './actionTypes';

const value = handleActions({
  [actionTypes.CHOOSE]: (state, action) => action.payload.item,
  [companySwitchActionTypes.SELECT]: () => null,
  [accessActionTypes.LOGIN]: () => null,
}, null);

const reducers = combineReducers({
  value,
});

const persistConfig = {
  key: 'service-company',
  storage,
  version: 1,
};

export default persistReducer(persistConfig, reducers);
