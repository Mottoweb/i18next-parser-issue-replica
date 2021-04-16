import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Icons } from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import DateCell from 'src/components/DateCell';
import { fromDateTimeType } from '@adnz/api-helpers';
import * as selectors from '../../selectors';
import * as actions from '../../actions';

const stopPropagation = (evt) => evt.stopPropagation();

const Source = ({
  itemId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const source = useSelector((state) => selectors.getSource(state, { itemId }));
  const removing = useSelector((state) => selectors.isDeleting(state, { itemId }));
  const dispatch = useDispatch();
  const remove = React.useCallback(
    () => dispatch(actions.deleteSource(itemId)),
    [dispatch, itemId],
  );
  const edit = React.useCallback(
    () => dispatch(actions.openModal(itemId)),
    [dispatch, itemId],
  );
  const showDescriptionModal = React.useCallback(
    () => dispatch(actions.showDescriptionModal(itemId)),
    [dispatch, itemId],
  );
  const openBatchModal = React.useCallback(
    () => dispatch(actions.openBatchModal(itemId)),
    [dispatch, itemId],
  );
  return (
    <tbody className="dash-tbody position hover">
      <tr onClick={showDescriptionModal}>
        <td>{source.get('name')}</td>
        <td>{t(source.get('priority'))}</td>
        <DateCell value={fromDateTimeType(source.get('lastTaskDate'))} />
        <td onClick={stopPropagation}>
          <ButtonGroup align="right">
            <Button
              id="open-batch-modal-button"
              onClick={openBatchModal}
              icon
            >
              <Icons.PlusCircle />
            </Button>
            <Button
              id="edit-button"
              onClick={edit}
              icon
            >
              <Icons.EditAlt size={28} />
            </Button>
            <Button
              id="delete-button"
              isLoading={removing}
              onClick={remove}
              icon
            >
              <Icons.Trash />
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    </tbody>
  );
};

Source.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default Source;
