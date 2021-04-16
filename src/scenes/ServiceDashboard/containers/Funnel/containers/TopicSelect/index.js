import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ReactSelectV2Field from 'src/components/ReactSelectV2Field';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import * as selectors from './selectors';
import * as actions from './actions';

const TopicSelect = ({
  defaultTitle,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const options = useSelector(selectors.getItems);
  const value = useSelector(selectors.getActive);
  const dispatch = useDispatch();
  const onChange = React.useCallback(
    (v) => dispatch(actions.select(v, true)),
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
        id="topic-select"
        input={{
          name: 'topic-select',
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

TopicSelect.propTypes = {
  defaultTitle: PropTypes.string,
};

TopicSelect.defaultProps = {
  defaultTitle: 'SELECT_TOPIC',
};

export default TopicSelect;
