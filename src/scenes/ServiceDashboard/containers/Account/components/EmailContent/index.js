import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { useTranslation } from 'react-i18next';

const EmailContent = ({
  body,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  if (!body) {
    return (
      <div>{t('serviceDashboard:EMAIL_IS_EMPTY')}</div>
    );
  }
  return (
    <div
      className="email-modal__content"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
};

EmailContent.propTypes = {
  body: PropTypes.string.isRequired,
};

export default EmailContent;
