import React, { useCallback } from 'react';
import { Field, Form } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import Error from 'src/components/form/Error';
import { Link } from 'react-router-dom';
import {
  Label,
  Alert, Button, ButtonGroup, TooltipOver, RadioGroup, Icons,
} from '@adnz/ui';

import PageContainer from 'src/components/PageContainer';
import {
  Col,
  Row,
} from 'styled-bootstrap-grid';
import TextField from 'src/components/form/fields/TextField';
import CreditCards from 'src/scenes/Account/containers/Company/containers/CreditCards';
import CountryField from 'src/scenes/AccountsWithN4/containers/AccountForm/fields/CountryField';
import { InvoiceAddressForm } from '@adnz/api-ws-salesforce';
import { isNewCcCampaignAllowed } from '@adnz/api-ws-credit-card';
import FormGroup from 'src/components/form/FormGroup';
import { useRequest } from '@adnz/use-request';
import { Option } from 'src/types';
import {
  WrapperBlock,
  LeftBlock,
  RightBlock,
  MethodBlock,
} from './styles';
import { PaymentMethod } from './PaymentMethods';

export interface IBillingForm {
  onCancel: () => void,
  onSubmit: (values: InvoiceAddressForm) => void,
  isLoading?: boolean,
  submittable?: boolean,
  initialValues?: InvoiceAddressForm,
  agreementBlock?: () => React.ReactChild,
  withCreditCardInfo?: boolean,
  paymentMethod: string,
  setPaymentMethod: () => void,
  isCreditCardPayment?: boolean,
}

const BillingForm: React.FC<IBillingForm> = ({
  onCancel,
  onSubmit,
  isLoading = false,
  submittable = true,
  initialValues,
  agreementBlock,
  withCreditCardInfo = false,
  paymentMethod,
  setPaymentMethod,
  isCreditCardPayment,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const formatOptionLabel = useCallback((option) => t(option.label), [t]);

  const [newCampaignAllowed = true, { pending: pendingIsAllowed }, checkNewCampaignAllowed] = useRequest({
    apiMethod: isNewCcCampaignAllowed,
    runOnMount: false,
  });

  React.useEffect(() => {
    if (paymentMethod === PaymentMethod.CreditCard) {
      checkNewCampaignAllowed();
    }
  }, [checkNewCampaignAllowed, paymentMethod]);

  const areCreditCardPaymentsFailed = React.useMemo(
    () => paymentMethod === PaymentMethod.CreditCard && !newCampaignAllowed,
    [newCampaignAllowed, paymentMethod],
  );
  const options = React.useMemo<Option<PaymentMethod>[]>(() => ([{
    label: t('serviceDashboard:INVOICE'),
    value: PaymentMethod.Invoice,
  }, {
    label: t('serviceDashboard:CREDIT_CARD'),
    value: PaymentMethod.CreditCard,
  }]), [t]);

  return (
    <Form<InvoiceAddressForm>
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit }) => (
        <form data-testid="payment-table" onSubmit={handleSubmit}>
          <PageContainer gutter="small">
            <WrapperBlock>
              <LeftBlock>
                {isCreditCardPayment && (
                <>
                  <div>
                    {t('serviceDashboard:SELECT_PAYMENT_METHOD')}
                  </div>
                  <MethodBlock>
                    <RadioGroup
                      onChange={setPaymentMethod}
                      formatOptionLabel={formatOptionLabel}
                      value={options.filter((item) => item.value === paymentMethod)[0]}
                      options={options}
                    />
                  </MethodBlock>
                </>
                )}
                {withCreditCardInfo && (
                  <CreditCards onlyInfo />
                )}
              </LeftBlock>
              <RightBlock>
                <div css="margin-bottom: 20px;">
                  {t('serviceDashboard:INVOICE_ADDRESS_BLOCK_TITLE')}
                  <TooltipOver
                    message={t('serviceDashboard:INVOICE_ADDRESS_BLOCK_TIP')}
                  >
                    <Icons.QuestionCircle css="margin-left: 3px;" size={14} />
                  </TooltipOver>
                </div>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label name="invoiceName" required>{t('serviceDashboard:NAME')}</Label>
                      <Field
                        name="invoiceName"
                        render={(props) => (<TextField {...props} />)}
                      />
                      <Error name="invoiceName" />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>{t('serviceDashboard:STREET_NR')}</Label>
                      <Field
                        name="street"
                        render={(props) => (<TextField {...props} />)}
                      />
                      <Error name="street" />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>{t('serviceDashboard:POSTCODE')}</Label>
                      <Field
                        name="zipCode"
                        render={(props) => (<TextField {...props} />)}
                      />
                      <Error name="zipCode" />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>{t('serviceDashboard:ADDRESS_LINE_2')}</Label>
                      <Field
                        name="street2"
                        render={(props) => (<TextField {...props} />)}
                      />
                      <Error name="street2" />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>{t('serviceDashboard:ADDRESS_LINE_3')}</Label>
                      <Field
                        name="street3"
                        render={(props) => (<TextField {...props} />)}
                      />
                      <Error name="street3" />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>{t('serviceDashboard:CITY')}</Label>
                      <Field
                        name="city"
                        render={(props) => (<TextField {...props} />)}
                      />
                      <Error name="city" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col data-tesid="country-dropdown" md={4}>
                    <FormGroup>
                      <Label>{t('serviceDashboard:COUNTRY')}</Label>
                      <CountryField
                        name="countryCode"
                        placeholder={t('serviceDashboard:COUNTRY')}
                      />
                      <Error name="countryCode" />
                    </FormGroup>
                  </Col>
                  {agreementBlock && (
                    <Col data-testid="agreement-block" lg={8}>
                      {agreementBlock()}
                    </Col>
                  )}
                </Row>
              </RightBlock>
            </WrapperBlock>
            {withCreditCardInfo && (
              <Alert type="info" title={t('serviceDashboard:CREDIT_CARD_INFO_TITLE')} message={t('serviceDashboard:CREDIT_CARD_INFO')} />
            )}
            {areCreditCardPaymentsFailed && (
              <>

                <div className="spacer" />
                <Alert
                  type="warning"
                  message={(
                    <>
                      <span>{t('serviceDashboard:ADD_ANOTHER_CREDIT_CARD')}</span>
                      <Link id="add-card-link" to="/account/company">{t('serviceDashboard:ADD_ANOTHER_CREDIT_CARD_2')}</Link>
                    </>
)}
                />
              </>
            )}
          </PageContainer>
          <ButtonGroup
            spacer="top"
            align="right"
            vertical
          >
            <Button
              data-testid="confirm-payment-button"
              disabled={!submittable || areCreditCardPaymentsFailed}
              theme="accept"
              isLoading={isLoading || pendingIsAllowed}
              onClick={() => handleSubmit()}
            >
              <span>{t('serviceDashboard:CONFIRM_PAYMENT')}</span>
            </Button>
            <Button
              onClick={onCancel}
              theme="create-secondary"
            >
              {t('serviceDashboard:BACK')}
            </Button>
          </ButtonGroup>
        </form>
      )}
    />
  );
};

export default BillingForm;
