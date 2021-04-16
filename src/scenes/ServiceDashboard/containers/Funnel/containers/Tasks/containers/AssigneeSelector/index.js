import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AsyncSelectField from 'src/components/form/fields/AsyncSelectField';
import * as selectors from './selectors';
import * as taskActions from '../../actions';
import { useSelectOptionsCacheContext } from '../../../SalesSelect/SelectOptionsCacheContext';

const meta = {};

const Select = ({
  taskId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const item = useSelector((state) => selectors.getActiveById(state, { itemId: taskId }));
  const dispatch = useDispatch();

  const { loadOptions } = useSelectOptionsCacheContext();

  const onChange = React.useCallback(
    (value) => dispatch(taskActions.setAssignee(taskId, value?.value ?? null)),
    [dispatch, taskId],
  );

  return (
    <AsyncSelectField
      input={{
        name: 'assign-select',
        value: item,
        onChange,
        onFocus: () => {},
        onBlur: () => {},
        onDragStart: () => {},
        onDrop: () => {},
      }}
      meta={meta}
      loadOptions={loadOptions}
      placeholder={t('serviceDashboard:SELECT_ASSIGNEE')}
      isClearable
      defaultOptions
      styles={{ option: (base) => ({ ...base, wordBreak: 'break-all' }) }}
    />
  );
};

Select.propTypes = {
  taskId: PropTypes.string.isRequired,
};

export default Select;
