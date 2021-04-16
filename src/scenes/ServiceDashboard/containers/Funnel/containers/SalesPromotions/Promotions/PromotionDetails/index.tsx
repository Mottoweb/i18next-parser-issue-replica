import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
} from 'styled-bootstrap-grid';
import { Button, TabButton, PageHeader } from '@adnz/ui';
import Colors from 'src/theme/Colors';
import { useRequest } from '@adnz/use-request';
import {
  getSalesPromotionById,
} from '@adnz/api-ws-funnel';
import LoaderComponent from 'src/components/Loader';
import * as actions from '../../actions';
import { useDispatch, useSelector } from '../../context';
import PromotionForm from '../PromotionForm';
import * as selectors from '../../selectors';
import Contacts from '../Contacts';
import Accounts from '../Accounts';
import Campaigns from '../Campaigns';
import Documents from '../Documents';
import { Title, Tag } from './styles';

const PromotionDetails: React.FC<{ promotionId: string }> = ({ promotionId }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const [showAccounts, setShowAccounts] = React.useState<boolean>(true);
  const promotion = useSelector(selectors.getPromotionDetails, []);

  const [, { pending }] = useRequest({
    apiMethod: getSalesPromotionById,
    runOnMount: true,
    parameters: [{ salesPromotionId: promotionId }],
    onSuccess: React.useCallback(
      (data) => {
        dispatch(actions.SAVE_PROMOTION_DETAILS(data));
      },
      [dispatch],
    ),
  });

  const openEdit = () => dispatch(actions.OPEN_EDIT_PROMOTION(promotionId));

  return pending ? <LoaderComponent /> : (
    <>
      <PageHeader
        title={(
          <Title>
            {promotion?.name}
            <Tag color={Colors['adnz-green']} value={t(promotion?.phase ? promotion.phase : '')} />
          </Title>
        )}
        actions={(
          <Button
            onClick={openEdit}
            id="editPromotionButton"
            dataTestId="edit-promotion"
          >
            {t('serviceDashboard:EDIT')}
          </Button>
        )}
      />
      <PromotionForm isDetailsOpened />
      <Container>
        <TabButton.Group>
          <TabButton
            title={t('serviceDashboard:ACCOUNTS')}
            active={showAccounts}
            onClick={() => setShowAccounts(true)}
            data-testid="accounts-page"
          />
          <TabButton
            title={t('serviceDashboard:CONTACTS')}
            active={!showAccounts}
            onClick={() => setShowAccounts(false)}
            data-testid="contacts-page"
          />
        </TabButton.Group>
        {showAccounts ? <Accounts salesPromotionId={promotionId} /> : <Contacts salesPromotionId={promotionId} /> }
        <Campaigns isOrder={false} />
        <Campaigns isOrder />
        <Documents salesPromotionId={promotionId} />
      </Container>
    </>
  );
};

export default PromotionDetails;
