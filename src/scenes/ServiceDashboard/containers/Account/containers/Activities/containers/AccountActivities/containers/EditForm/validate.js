import i18n from 'src/i18n';

const validate = (values) => {
  const errors = {};
  if (!values.get('activityType')) {
    errors.activityType = i18n.t('serviceDashboard:TOUCHPOINT_TYPE_IS_REQUIRED');
  }
  if (!values.get('message')) {
    errors.message = i18n.t('serviceDashboard:DESCRIPTION_IS_REQUIRED');
  }
  return errors;
};

export default validate;
