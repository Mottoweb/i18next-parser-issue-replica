import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert, Button, ButtonGroup, InnerGroup, Table,
} from '@adnz/ui';
import {
  Row,
  Col,
} from 'styled-bootstrap-grid';
import {
  Field,
  reduxForm,
} from 'redux-form/immutable';
import i18n from 'src/i18n';
import TextareaField from 'src/components/TextareaV2Field';
import { formDecorator } from 'src/components/FieldDecorator';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getAuthHeaders } from 'src/api';
import RteField from 'src/components/RteField';
import {
  splitEmails,
} from 'src/helpers';
import * as actions from '../../actions';
import * as emailFormActions from './actions';
import * as selectors from '../../selectors';
import * as emailFormSelectors from './selectors';
import AttachmentUploader from './AttachmentUploader/index';
import Attachment from './Attachment/index';

const validate = (values) => {
  const errors = {};
  if (!values.get('subject')) {
    errors.subject = i18n.t('serviceDashboard:ENTER_SUBJECT');
  }
  if (!values.get('content')) {
    errors.content = i18n.t('serviceDashboard:ENTER_CONTENT');
  }
  return errors;
};

const FormComponent = ({
  handleSubmit,
  error,
  submitting,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const files = useSelector(emailFormSelectors.getFiles);
  const draftId = useSelector(emailFormSelectors.getDraftId);
  const dispatch = useDispatch();
  React.useEffect(
    () => () => {
      if (draftId) {
        dispatch(emailFormActions.removeDraft());
      }
    },
    [draftId, dispatch],
  );
  return (
    <>
      {error && <Alert type="error" message={error} />}
      <form autoComplete="false" onSubmit={handleSubmit}>
        <Field
          data-testid="mail-input"
          name="toEmails"
          type="text"
          component={TextareaField}
          renderLayout={formDecorator(false, { wrapperClassName: 'modal-mail__field-input' })}
          rows={1}
        />
        <Field
          name="ccEmails"
          type="text"
          component={TextareaField}
          renderLayout={formDecorator(false, { wrapperClassName: 'modal-mail__field-input' })}
          placeholder={t('serviceDashboard:CC_MAIL')}
          rows={1}
        />
        <Field
          name="bccEmails"
          type="text"
          component={TextareaField}
          renderLayout={formDecorator(false, { wrapperClassName: 'modal-mail__field-input' })}
          placeholder={t('serviceDashboard:BCC_MAIL')}
          rows={1}
        />
        <Field
          name="subject"
          type="text"
          component={TextareaField}
          renderLayout={formDecorator(false, { wrapperClassName: 'modal-mail__field-input' })}
          placeholder={t('serviceDashboard:EMAIL_SUBJECT')}
          rows={1}
        />
        <Row>
          <div className="clearfix modal-mail__field-rte">
            <Field
              name="content"
              type="text"
              component={RteField}
              showPlaceholderButtons={false}
              size={12}
            />
          </div>
          {!!files.size && (
            <Col xs={12}>
              <InnerGroup>
                <Table>
                  <tbody>
                    {files.map((file) => <Attachment file={file} />)}
                  </tbody>
                </Table>
              </InnerGroup>
            </Col>
          )}
        </Row>
        <Row>
          <Col xs={12}>
            <ButtonGroup data-testid="attachment-uploader-button" align="right">
              {draftId
                ? (
                  <AttachmentUploader
                    target={`${axios.defaults.baseURL}/api/ws-email-sync/email/draft/${draftId}/attachment`}
                    headers={getAuthHeaders()}
                  />
                )
                : <Button disabled isLoading icon />}
              <Button
                data-testid="send-email-button"
                type="submit"
                disabled={submitting}
                isLoading={submitting}
              >
                <span>{t('serviceDashboard:SEND')}</span>
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </form>
    </>
  );
};

FormComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
};

FormComponent.defaultProps = {
  error: undefined,
};

const FormForm = reduxForm({
  form: 'email-funnel-form',
  enableReinitialize: true,
  validate,
})(FormComponent);

const Form = () => {
  const initialValues = useSelector(selectors.getEmailFormInitialValues);
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(
    (data) => dispatch(actions.sendEmail({
      ...data.toJS(),
      toEmails: splitEmails(data.get('toEmails')),
      ccEmails: splitEmails(data.get('ccEmails')),
      bccEmails: splitEmails(data.get('bccEmails')),
    })),
    [dispatch],
  );
  return (
    <FormForm
      onSubmit={onSubmit}
      initialValues={initialValues}
    />
  );
};

export default Form;
