import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ReactSelectV2Field from 'src/components/ReactSelectV2Field';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import * as selectors from './selectors';
import * as actions from './actions';

const UserSelect = ({
  defaultTitle,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const options = useSelector(selectors.getSalesContacts);
  const value = useSelector(selectors.getActive);
  const dispatch = useDispatch();
  const onChange = React.useCallback(
    (v) => dispatch(actions.select(v)),
    [dispatch],
  );
  useEffectWithToken(
    (token) => dispatch(actions.getItems(token)),
    [],
    true,
  );
  return (
    <div className="flex-page__page-select">
      <ReactSelectV2Field
        id="user-select"
        input={{
          name: 'user-select',
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

UserSelect.propTypes = {
  defaultTitle: PropTypes.string,
};

UserSelect.defaultProps = {
  defaultTitle: 'SELECT_USER',
};

export default UserSelect;
