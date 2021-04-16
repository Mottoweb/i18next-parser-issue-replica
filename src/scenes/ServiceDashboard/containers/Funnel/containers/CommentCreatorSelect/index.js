import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ReactSelectV2Field from 'src/components/ReactSelectV2Field';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import * as selectors from './selectors';
import * as actions from './actions';

const CommentCreatorSelect = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const defaultTitle = 'SELECT_CREATOR';
  const options = useSelector(selectors.getItems);
  const value = useSelector(selectors.getActive);
  const dispatch = useDispatch();
  const onChange = React.useCallback(
    (v) => dispatch(actions.select(v)),
    [dispatch],
  );
  useEffectWithToken(
    (token, query) => dispatch(actions.getItems(token, query)),
    [],
    true,
  );
  return (
    <div className="flex-page__page-select">
      <ReactSelectV2Field
        id="touchpoint-creator-select"
        input={{
          name: 'touchpoint-creator-select',
          value,
          onChange,
          onFocus: () => {},
          onBlur: () => {},
          onDragStart: () => {},
          onDrop: () => {},
        }}
        placeholder={t(defaultTitle)}
        options={options}
        isClearable
        styles={{ option: (base) => ({ ...base, wordBreak: 'break-all' }) }}
      />
    </div>
  );
};

export default CommentCreatorSelect;
