import React from 'react';
import { useTranslation } from 'react-i18next';
import Container from '../../../Campaign/components/DetailsInfoBlock/components/Container';

const Body = ({ account }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const invoiceMailAddresses = account.get('invoiceMailAddresses');
  const reportMailAddresses = account.get('reportMailAddresses');
  const screenshotMailAddresses = account.get('screenshotMailAddresses');

  return (
    <Container>
      {invoiceMailAddresses && (
        <div>
          <div>{t('serviceDashboard:INVOICE')}</div>
          {invoiceMailAddresses.map((mail) => (
            <div key={mail}>
              <a href={`mailto:${mail}`}>{mail}</a>
            </div>
          ))}
        </div>
      )}
      {reportMailAddresses && (
        <div css="margin-top: 10px;">
          <div>{t('serviceDashboard:REPORTING')}</div>
          {reportMailAddresses.map((mail) => (
            <div key={mail}>
              <a href={`mailto:${mail}`}>{mail}</a>
            </div>
          ))}
        </div>
      )}
      {screenshotMailAddresses && (
        <div css="margin-top: 10px;">
          <div>{t('serviceDashboard:SCREENSHOTS')}</div>
          {screenshotMailAddresses.map((mail) => (
            <div key={mail}>
              <a href={`mailto:${mail}`}>{mail}</a>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

const Footer = () => null;

Footer.propTypes = {};

Footer.defaultProps = {};

export default {
  Body,
  Footer,
};
