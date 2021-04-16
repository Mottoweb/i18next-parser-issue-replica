import React, {
  FunctionComponent,
  useState,
} from 'react';
import {
  Container,
} from 'styled-bootstrap-grid';
import { useTranslation, Trans } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import { Checkbox } from '@adnz/ui';
import {
  findByCampaignIdCheckRole, CampaignForm, updateCampaignStage, updateCampaignBillingAddressInfo,
} from '@adnz/api-ws-salesforce';
import CampaignPDFPreview from 'src/components/CampaignPDFPreview';
import SectionTitle from 'src/components/SectionTitle';
import { useRequest } from '@adnz/use-request';
import { CAMPAIGN_STAGES } from 'src/constants';

import confirmAlert from 'src/components/confirmAlert';
import notify from 'src/modules/Notification';
import { useSelector } from 'src/scenes/Account/containers/Company/containers/CreditCards/context';
import * as selectors from 'src/scenes/Account/containers/Company/containers/CreditCards/selectors';
import BillingForm from 'src/scenes/ServiceDashboard/containers/PaymentDetails/BillingForm';
import LoaderComponent from 'src/components/Loader';
import { PaymentMethod } from './PaymentMethods';
import {
  AgreementField,
  PDFPreviewBlock,
} from './styles';

const AgreementBlock: React.FC<{ agreement: boolean, setAgreement: (value: boolean) => void }> = ({
  agreement,
  setAgreement,
}) => (
  <AgreementField>
    <Checkbox
      checked={agreement}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAgreement(e.target.checked)}
    />
    <span css="margin-left: 10px;">
      <Trans i18nKey="CONFIRM_AGREEMENT" ns="serviceDashboard">
        <a
          href="https://audienzz.ch/wp-content/uploads/2020/02/AGB_neu.pdf"
          target="_blank"
          rel="noreferrer noopener"
        >
          T&Cs
        </a>
      </Trans>
    </span>
  </AgreementField>
);

const PaymentDetails:FunctionComponent<{ renderUpperMenu: FunctionComponent }> = ({
  renderUpperMenu = undefined,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod|null>(null);
  const [agreement, setAgreement] = useState<boolean>(false);
  const history = useHistory();
  const { campaignId, type } = useParams<{ campaignId: string, type:string }>();
  const isCreditCardPresent = useSelector(selectors.isCreditCardPresent, []);

  const [campaign, { pending: loadingCampaign }] = useRequest({
    apiMethod: findByCampaignIdCheckRole,
    parameters: [{ campaignId }],
  });

  const initialValues = React.useMemo(() => campaign && campaign.advertiserAccount, [campaign]);

  const [, { pending: isUpdatingStage }, updateStage] = useRequest({
    apiMethod: updateCampaignStage,
    runOnMount: false,
    onSuccess: React.useCallback(
      () => {
        confirmAlert({
          title: t('serviceDashboard:MESSAGE'),
          message: t('serviceDashboard:PAYMENT_COMPLETE_MESSAGE'),
          withoutClose: true,
          buttons: [
            {
              label: t('serviceDashboard:OK'),
              onClick: (close) => {
                close();
                history.push(`/buy-side/campaigns/${type}/${campaignId}`);
              },
            },
          ],
        });
      },
      [t, history, type, campaignId],
    ),
    onFail: React.useCallback(
      ({ response }) => { throw new Error(response?.data.message); },
      [],
    ),
  });

  const [, { pending: isUpdatingBilling }, updateBillingInfo] = useRequest({
    apiMethod: updateCampaignBillingAddressInfo,
    runOnMount: false,
    onFail: React.useCallback(
      ({ response }) => { throw new Error(response?.data.message); },
      [],
    ),
  });

  const loading = React.useMemo(() => isUpdatingStage || isUpdatingBilling, [isUpdatingStage, isUpdatingBilling]);

  const handleSubmit = React.useCallback(async (values, isCreditCardPayment = false) => {
    try {
      await updateBillingInfo(values, { campaignId });
      await updateStage(
        { stage: CAMPAIGN_STAGES.PENDING_APPROVAL } as CampaignForm,
        { campaignId, isCreditCardPayment },
      );
    } catch (e) {
      notify.danger(t('serviceDashboard:ERROR'), t(e.message));
    }
  }, [campaignId, t, updateBillingInfo, updateStage]);

  React.useEffect(() => {
    if (campaign?.isCreditCardPayment) {
      setPaymentMethod(PaymentMethod.CreditCard);
    } else {
      setPaymentMethod(PaymentMethod.Invoice);
    }
  }, [campaign]);

  if (loadingCampaign) {
    return <LoaderComponent />;
  }

  return (
    <>
      {!!renderUpperMenu && renderUpperMenu({})}
      <Container>
        <SectionTitle>{`${t('serviceDashboard:YOUR_ORDER')}:`}</SectionTitle>
        <PDFPreviewBlock>
          <CampaignPDFPreview campaignId={campaignId} onlyData />
        </PDFPreviewBlock>
        {paymentMethod === PaymentMethod.Invoice && (
          <BillingForm
            initialValues={initialValues}
            onSubmit={async (values) => {
              await handleSubmit(values);
            }}
            isLoading={loading}
            onCancel={() => history.goBack()}
            submittable={agreement}
            isCreditCardPayment={!campaign?.isCreditCardPayment}
            paymentMethod={paymentMethod}
            setPaymentMethod={() => setPaymentMethod(PaymentMethod.CreditCard)}
            agreementBlock={() => (
              <AgreementBlock agreement={agreement} setAgreement={setAgreement} />
            )}
          />
        )}
        {paymentMethod === PaymentMethod.CreditCard && (
        <BillingForm
          initialValues={initialValues}
          onSubmit={async (values) => {
            await handleSubmit(values, true);
          }}
          isLoading={loading}
          onCancel={() => history.goBack()}
          submittable={agreement && isCreditCardPresent}
          isCreditCardPayment={!campaign?.isCreditCardPayment}
          paymentMethod={paymentMethod}
          setPaymentMethod={() => setPaymentMethod(PaymentMethod.Invoice)}
          agreementBlock={() => (
            <AgreementBlock agreement={agreement} setAgreement={setAgreement} />
          )}
          withCreditCardInfo
        />
        )}
      </Container>
    </>
  );
};

export default PaymentDetails;
