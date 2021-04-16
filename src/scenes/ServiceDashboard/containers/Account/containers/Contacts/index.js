import React from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'src/components/SectionTitle';
import {
  Button, Checkbox, Label,
} from '@adnz/ui';
import Colors from 'src/theme/Colors';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Table from 'src/modules/Table';
import TableV2Field from 'src/components/TableV2Field';
import * as selectors from '../../selectors';
import Row from './Row';
import * as actions from '../../actions';

const CustomCheckBox = styled.div`
  padding: 6px 12px;
  margin-bottom: 5px;
  border: 1px solid ${Colors['very-light-pink-four']};
  border-radius: 2px;
  font-size: 13px;
  label {
    margin-bottom: 0;
    color: ${Colors['adnz-grey']};
  }
`;

const Contacts = ({
  itemId,
  limit,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();
  const dispatch = useDispatch();
  const items = useSelector((state) => selectors.getFilteredContacts(state, { itemId }));
  const endpoint = React.useCallback(
    () => Promise.resolve(),
    [],
  );
  const [includeInactive, setActiveFilter] = React.useState(false);
  const contacts = React.useMemo(
    () => (includeInactive ? items : items.filter((item) => item.get('active') === true)),
    [items, includeInactive],
  );
  const onHandleSuccess = React.useCallback(
    (item) => dispatch(actions.toggleContactState(item)),
    [dispatch],
  );

  return (
    <>
      <div css="display: flex;justify-content: space-between;align-items: center;">
        <SectionTitle>
          {t('serviceDashboard:CONTACTS')}
        </SectionTitle>
        <Button
          onClick={() => history.push(`/buy-side/accounts/edit/${itemId}/contacts/create`
            + `?redirectTo=/buy-side/accounts/${itemId}`)}
        >
          {t('serviceDashboard:CREATE_NEW_CONTACT')}
        </Button>
      </div>
      <CustomCheckBox className="checkbox_custom" dataTestId="checkbox-label">
        <Label type="inline-checkbox" data-testid="checkbox-label">
          <Checkbox
            checked={includeInactive}
            name="isShownincludeInactive"
            id="isShownincludeInactive"
            onChange={(e) => setActiveFilter(e.target.checked)}
          />
          <span>{t('serviceDashboard:INCLUDE_INACTIVE')}</span>
        </Label>
      </CustomCheckBox>
      <Table
        instance="contacts-table"
        component={TableV2Field}
        endpoint={endpoint}
        items={contacts}
        limit={limit}
        idField={(id) => id}
        responsive
        fields={[
          {
            key: 'lastName',
            name: t('serviceDashboard:FIELD_LASTNAME'),
            sortable: true,
          },
          {
            key: 'firstName',
            name: t('serviceDashboard:FIELD_FIRSTNAME'),
            sortable: true,
          },
          {
            key: 'function',
            name: t('serviceDashboard:FUNCTION'),
            sortable: true,
          },
          {
            key: 'email',
            name: t('serviceDashboard:EMAIL'),
            sortable: true,
          },
          {
            key: 'phone',
            name: t('serviceDashboard:TELEPHONE'),
          },
          {
            key: 'phoneMobile',
            name: t('serviceDashboard:MOBILEPHONE'),
          },
          {
            key: 'active',
            name: t('serviceDashboard:ACTIVE'),
            sortable: true,
          },
          {
            key: 'state',
            name: '',
          },
          {
            key: 'buttons',
            name: '',
          },
        ]}
        pagerComponent={null}
        rowComponent={({ item }) => (
          <Row
            key={item.get('id')}
            contact={item}
            accountId={itemId}
            itemId={item.get('id')}
            handleSuccess={onHandleSuccess}
          />
        )}
      />
    </>
  );
};

Contacts.propTypes = {
  itemId: PropTypes.string.isRequired,
  limit: PropTypes.number,
};

Contacts.defaultProps = {
  limit: 1000,
};

export default Contacts;
