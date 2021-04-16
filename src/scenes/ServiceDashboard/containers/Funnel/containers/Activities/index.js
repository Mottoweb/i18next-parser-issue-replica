import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
} from 'styled-bootstrap-grid';
import { useTranslation } from 'react-i18next';
import InfiniteTable from 'src/modules/InfiniteTable';
import { CampaignFiltersContext } from 'src/modules/CampaignFilters/context';
import { PageHeader, Button } from '@adnz/ui';
import Activity from './containers/Activity';
import * as selectors from './selectors';
import * as actions from './actions';
import {
  getActiveId as getSelectedCreator,
} from '../CommentCreatorSelect/selectors';
import {
  getActiveId as getSelectedContact,
} from '../ContactSelect/selectors';
import CreateModal from './containers/CreateModal';

const Activities = ({ filtersGroup }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { filters } = useContext(CampaignFiltersContext);
  const items = useSelector(selectors.getIds);
  const total = useSelector(selectors.getTotal);
  const creatorId = useSelector(getSelectedCreator);
  const contactId = useSelector(getSelectedContact);
  const dispatch = useDispatch();
  const endpoint = React.useCallback(
    (args) => dispatch(actions.getActivities(args)),
    [dispatch],
  );
  const create = React.useCallback(
    () => dispatch(actions.openCreateModal()),
    [dispatch],
  );
  return (
    <>
      <CreateModal />
      <PageHeader
        title={t('serviceDashboard:ACTIVITIES')}
        children={filtersGroup}
        actions={(<Button onClick={create} dataTestId="create-activities-button">{t('serviceDashboard:CREATE_ACTIVITY')}</Button>)}
      />
      <Container id="activities-grid">
        <div
          className="table-container table-container-mobile activities-table"
          id="created-activities"
        >
          <InfiniteTable
            instance="activities"
            endpoint={endpoint}
            items={items}
            limit={25}
            total={total}
            query={{
              accountId: filters.agency ? filters.agency.id : null,
              creatorId,
              contactId,
            }}
            idField={(id) => id}
            fields={[
              {
                key: 'creationDate',
                name: t('serviceDashboard:CREATED'),
                sortable: true,
              },
            ]}
            defaultOrderField="creationDate"
            defaultOrderDirection="desc"
            rowRenderer={(id) => (
              <Activity key={id} activityId={id} />
            )}
          />
        </div>
      </Container>
    </>
  );
};

Activities.propTypes = {
  filtersGroup: PropTypes.node.isRequired,
};

export default Activities;
