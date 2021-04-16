import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Icons } from '@adnz/ui';
import * as actions from 'src/scenes/ServiceDashboard/containers/Account/actions';
import * as selectors from 'src/scenes/ServiceDashboard/containers/Account/selectors';
import Table from 'src/modules/Table';
import * as tableAction from 'src/modules/Table/actions';
import ReactPaginate from 'react-paginate';
import SectionTitle from 'src/components/SectionTitle';
import { isPermissionsToAccount } from 'src/selectors';
import Email from './containers/Email';
import EmailModal from '../EmailView';

const EmailTableContainer = ({
  limit,
  sortable,
  itemId,
  emailFilter,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const total = useSelector(selectors.getTotal);
  const items = useSelector(selectors.getIds);
  const isLoading = useSelector(selectors.isLoading);
  const dispatch = useDispatch();
  const endpoint = React.useCallback(
    (args) => dispatch(actions.getEmails(args, 'emails')),
    [dispatch],
  );
  const paginate = React.useCallback(
    (page) => dispatch(tableAction.setPage('emails-table', page)),
    [dispatch],
  );
  return (
    <>
      <SectionTitle>{t('serviceDashboard:EMAILS')}</SectionTitle>
      <EmailModal />
      <Table
        instance="emails-table"
        endpoint={endpoint}
        items={items}
        limit={limit}
        query={{
          accountId: itemId,
          emailFilter: emailFilter || [''],
        }}
        loading={isLoading}
        total={total}
        idField={(id) => id}
        enablePager={false}
        fields={[
          {
            key: 'internalDate',
            name: t('serviceDashboard:DATE'),
            sortable,
          },
          {
            key: 'recipient',
            name: t('serviceDashboard:RECIPIENT'),
            sortable,
          },
          {
            key: 'sender',
            name: t('serviceDashboard:SENDER'),
            sortable,
          },
          {
            key: 'subject',
            name: t('serviceDashboard:SUBJECT'),
            sortable,
          },
          {
            key: 'buttons',
            name: '',
          },
        ]}
        defaultOrderField="internalDate"
        defaultOrderDirection="desc"
        rowRenderer={(id) => (
          <Email key={id} itemId={id} />
        )}
      />
      {total > limit
      && (
        <ReactPaginate
          pageCount={Math.ceil(total / limit)}
          pageRangeDisplayed={1}
          marginPagesDisplayed={2}
          onPageChange={({ selected }) => paginate(selected + 1)}
          containerClassName="pagination"
          activeClassName="active"
          breakLabel={<a>...</a>}
          previousLabel={<Icons.Angle direction="left" size={18} />}
          nextLabel={<Icons.Angle direction="right" size={18} />}
        />
      )}
    </>
  );
};

EmailTableContainer.propTypes = {
  limit: PropTypes.number.isRequired,
  sortable: PropTypes.bool.isRequired,
  itemId: PropTypes.string.isRequired,
  emailFilter: ImmutablePropTypes.list.isRequired,
};

const EmailTableContainerWrapper = ({
  itemId, limit, sortable, emailFilter,
}) => {
  const visible = useSelector((state) => isPermissionsToAccount(state, { itemId }));
  if (!visible) {
    return null;
  }
  return (
    <EmailTableContainer
      limit={limit}
      sortable={sortable}
      itemId={itemId}
      emailFilter={emailFilter}
    />
  );
};

EmailTableContainerWrapper.propTypes = {
  limit: PropTypes.number,
  sortable: PropTypes.bool,
  itemId: PropTypes.string.isRequired,
  emailFilter: ImmutablePropTypes.list,
};

EmailTableContainerWrapper.defaultProps = {
  limit: 20,
  sortable: true,
  emailFilter: undefined,
};

export default EmailTableContainerWrapper;
