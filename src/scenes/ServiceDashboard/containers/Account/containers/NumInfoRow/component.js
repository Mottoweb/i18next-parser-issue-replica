import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Roles, PrivateRoute } from '@adnz/use-auth';
import { CampaignFiltersContext, FILTER_TYPES } from 'src/modules/CampaignFilters/context';
import { BarsLoader, Icons } from '@adnz/ui';
import Colors from 'src/theme/Colors';
import {
  NumInfoRow,
  NumContainer,
  Number,
  Title,
  Note,
} from './styles';

const Numbers = ({
  leadsCount,
  leadsLoading,
  tasksCount,
  tasksLoading,
  finishedTasksCount,
  finishedTasksLoading,
  offeredCount,
  offeredLoading,
  bookedCount,
  bookedLoading,
  runningCount,
  runningLoading,
  archivedCount,
  archivedLoading,
  account,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { changeFilter } = useContext(CampaignFiltersContext);
  const history = useHistory();
  const navigate = useCallback((link) => {
    changeFilter(FILTER_TYPES.ACCOUNT, account.toJS());
    history.push(link);
  }, [account, changeFilter, history]);
  return (
    <NumInfoRow>
      <PrivateRoute
        roles={[Roles.SALESFUNNEL]}
        render={() => (
          <>
            <NumContainer onClick={() => navigate('/workflows/salesFunnel/tasks/leads')}>
              <Icons.Customer
                size={30}
              />
              <Title>{t('serviceDashboard:LEADS')}</Title>
              <Number>
                {leadsLoading && (
                  <BarsLoader bgColor={Colors['greyish-brown']} />
                )}
                {!leadsLoading && leadsCount}
              </Number>
            </NumContainer>
            <NumContainer onClick={() => navigate('/workflows/salesFunnel/tasks/inprogress')}>
              <Icons.Booked
                css="margin-bottom: 5px;"
              />
              <Title>{t('serviceDashboard:TASKS')}</Title>
              <Number>
                {tasksLoading && finishedTasksLoading && (
                  <BarsLoader bgColor={Colors['greyish-brown']} />
                )}
                {!tasksLoading && !finishedTasksLoading && (
                  <span>{`${tasksCount} (${finishedTasksCount})`}</span>
                )}
              </Number>
              <Note>{`${t('serviceDashboard:ACTIVE')} (${t('serviceDashboard:FINISHED')})`}</Note>
            </NumContainer>
          </>
        )}
      />
      <NumContainer onClick={() => navigate('/buy-side/campaigns/OFFERED')}>
        <Icons.GetMoney
          size={30}
          css="margin-bottom: 5px;"
        />
        <Title>{t('serviceDashboard:OFFERED')}</Title>
        <Number>
          {offeredLoading && (
            <BarsLoader bgColor={Colors['greyish-brown']} />
          )}
          {!offeredLoading && offeredCount}
        </Number>
      </NumContainer>
      <NumContainer onClick={() => navigate('/buy-side/campaigns/BOOKED')}>
        <Icons.Billing size={27} css="margin-bottom: 2px;" />
        <Title>{t('serviceDashboard:BOOKED')}</Title>
        <Number>
          {bookedLoading && (
            <BarsLoader bgColor={Colors['greyish-brown']} />
          )}
          {!bookedLoading && bookedCount}
        </Number>
      </NumContainer>
      <NumContainer onClick={() => navigate('/buy-side/campaigns/RUNNING')}>
        <Icons.Loading size={25} />
        <Title>{t('serviceDashboard:RUNNING')}</Title>
        <Number>
          {runningLoading && (
            <BarsLoader bgColor={Colors['greyish-brown']} />
          )}
          {!runningLoading && runningCount}
        </Number>
      </NumContainer>
      <NumContainer onClick={() => navigate('/buy-side/campaigns/ARCHIVED')}>
        <Icons.Files size={25} />
        <Title>{t('serviceDashboard:ARCHIVED')}</Title>
        <Number
          data-testid="archived-campaigns-number-field"
        >
          {archivedLoading && (
            <BarsLoader bgColor={Colors['greyish-brown']} />
          )}
          {!archivedLoading && archivedCount}
        </Number>
      </NumContainer>
    </NumInfoRow>
  );
};

Numbers.propTypes = {
  leadsCount: PropTypes.number.isRequired,
  leadsLoading: PropTypes.bool.isRequired,
  tasksCount: PropTypes.number.isRequired,
  tasksLoading: PropTypes.bool.isRequired,
  offeredCount: PropTypes.number.isRequired,
  offeredLoading: PropTypes.bool.isRequired,
  bookedCount: PropTypes.number.isRequired,
  bookedLoading: PropTypes.bool.isRequired,
  runningCount: PropTypes.number.isRequired,
  runningLoading: PropTypes.bool.isRequired,
  archivedCount: PropTypes.number.isRequired,
  archivedLoading: PropTypes.bool.isRequired,
  finishedTasksCount: PropTypes.number.isRequired,
  finishedTasksLoading: PropTypes.bool.isRequired,
  account: PropTypes.instanceOf(Object).isRequired,
};

export default Numbers;
