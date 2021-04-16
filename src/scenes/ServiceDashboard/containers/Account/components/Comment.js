import React from 'react';
import { connect } from 'react-redux';
import { Section } from '@adnz/ui';
import SectionTitle from 'src/components/SectionTitle';
import { useTranslation } from 'react-i18next';
import { Roles, PrivateRoute } from '@adnz/use-auth';
import * as selectors from 'src/selectors';
import Colors from 'src/theme/Colors';

const Comment = ({
  account,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const comment = account.get('comment');
  const hasPermission = !!account.get('hasPermission');
  if (!hasPermission) {
    return null;
  }
  return (
    <PrivateRoute
      roles={[Roles.AGENCY, Roles.SELF_BOOKING, Roles.MANAGE_ACCOUNTS]}
      render={() => (
        <div data-testid="account-comments-section">
          <SectionTitle>{t('serviceDashboard:COMMENT')}</SectionTitle>
          {
            comment
              ? (
                <Section css="word-break: break-word;">
                  {account.get('comment')}
                </Section>
              )
              : <div css={`color: ${Colors['brown-grey-two']}; font-size: 13px`}>{t('serviceDashboard:THERE_ARE_NO_ENTRIES')}</div>
          }
        </div>
      )}
    />
  );
};

export default connect(
  (state, { itemId }) => ({
    account: selectors.getAccount(state, { itemId }),
  }),
)(Comment);
