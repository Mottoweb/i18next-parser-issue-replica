import React from 'react';
import { ActionType, StateType } from 'typesafe-actions';
import * as actions from './actions';
import reducer, { initialState } from './reducer';

type Dispatch = (action: ActionType<typeof actions>) => void;
type Context = [state: StateType<typeof reducer>, dispatch: Dispatch];
const context = React.createContext<Context>([initialState, () => {}]);

export const useSelector = <In extends unknown[], Out>(
  selector: (state: StateType<typeof reducer>, ...args: In) => Out,
  args: In,
): Out => {
  const [state] = React.useContext(context);
  return React.useMemo(
    () => selector(state, ...args),
    // TODO: fix
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, ...args],
  );
};

export const useDispatch = (): Dispatch => {
  const [, dispatch] = React.useContext(context);
  return dispatch;
};

export default context;
