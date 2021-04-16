import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Icons } from '@adnz/ui';
import * as selectors from '../../selectors';
import * as actions from '../../actions';

const Topic = ({
  itemId,
  showDescriptionModal,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const topic = useSelector((state) => selectors.getTopic(state, { itemId }));
  const removing = useSelector((state) => selectors.isDeleting(state, { itemId }));
  const dispatch = useDispatch();
  const remove = React.useCallback(
    () => dispatch(actions.deleteTopic(itemId)),
    [dispatch, itemId],
  );
  const edit = React.useCallback(
    () => dispatch(actions.openModal(itemId)),
    [dispatch, itemId],
  );
  return (
    <tbody className="dash-tbody position hover">
      <tr onClick={showDescriptionModal}>
        <td>{topic.get('name')}</td>
        <td className="text-left">{t(topic.get('description'))}</td>
        <td>
          <ButtonGroup align="right">
            <Button
              id="edit-button"
              onClick={edit}
              icon
            >
              <Icons.EditAlt size={28} />
            </Button>
            <Button
              id="delete-button"
              onClick={remove}
              isLoading={removing}
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

Topic.propTypes = {
  itemId: PropTypes.string.isRequired,
  showDescriptionModal: PropTypes.func.isRequired,
};

export default Topic;
