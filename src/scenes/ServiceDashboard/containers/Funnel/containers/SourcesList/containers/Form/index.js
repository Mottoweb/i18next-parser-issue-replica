import React from 'react';
import PropTypes from 'prop-types';
import useMarkdown from 'src/hooks/useMarkdown';
import {
  Alert, Button, ButtonGroup, Modal, TabButton, Label, InnerGroup,
} from '@adnz/ui';

import {
  Row,
  Col,
} from 'styled-bootstrap-grid';
import { Field, formValueSelector, reduxForm } from 'redux-form/immutable';
import TextV2Field from 'src/components/TextV2Field';
import { formDecorator } from 'src/components/FieldDecorator';
import SelectV2Field, { getValue } from 'src/components/ReactSelectV2Field';
import TextareaV2Field from 'src/components/TextareaV2Field';
import { useTranslation } from 'react-i18next';
import i18n from 'src/i18n';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../actions';
import * as selectors from '../../selectors';
import { MarkdownWrapper } from '../../styles';

const validate = (values) => {
  const errors = {};
  if (!values.get('name')) {
    errors.name = i18n.t('serviceDashboard:NAME_REQUIRED');
  }

  if (!values.get('priority')) {
    errors.priority = i18n.t('serviceDashboard:PRIORITY_REQUIRED');
  }
  return errors;
};

const SourcesComponent = ({
  handleSubmit,
  error,
  submitting,
  closeModal,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const showDescription = React.useCallback(
    (evt) => {
      evt.preventDefault();
      return dispatch(actions.showDescription());
    },
    [dispatch],
  );
  const showDescriptionMarkdown = React.useCallback(
    (evt) => {
      evt.preventDefault();
      return dispatch(actions.showDescriptionMarkdown());
    },
    [dispatch],
  );
  const isShowingDescription = useSelector(selectors.isShowingDescription);
  const markdownDescription = useSelector(
    (state) => formValueSelector('source-form')(state, 'description'),
  );
  const html = useMarkdown(markdownDescription);
  return (
    <>
      {error && <Alert type="error" message={error} />}
      <form autoComplete="false" id="name-sources-pop-up" onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6} data-testid="source-name-field">
              <Field
                name="name"
                component={TextV2Field}
                type="text"
                renderLayout={formDecorator(t('serviceDashboard:NAME'), {
                  requiredLabel: true,
                })}
              />
            </Col>
            <Col md={6} data-testid="priority-field-dropdown-list">
              <Field
                id="priority-field-dropdown-list"
                name="priority"
                component={SelectV2Field}
                isClearable
                loading={false}
                options={[
                  { value: 'LOW', label: t('serviceDashboard:LOW') },
                  { value: 'MEDIUM', label: t('serviceDashboard:MEDIUM') },
                  { value: 'HIGH', label: t('serviceDashboard:HIGH') },
                ]}
                renderLayout={formDecorator(t('serviceDashboard:PRIORITY'), {
                  requiredLabel: true,
                })}
              />
            </Col>
          </Row>
          <InnerGroup>
            <TabButton.Group>
              <TabButton
                onClick={showDescriptionMarkdown}
                active={!isShowingDescription}
                title={t('serviceDashboard:EDIT_MARKDOWN')}
              />
              <TabButton
                onClick={showDescription}
                active={isShowingDescription}
                title={t('serviceDashboard:PREVIEW')}
              />
            </TabButton.Group>
          </InnerGroup>
          {isShowingDescription
            ? (
              <InnerGroup data-testid="source-description-preview">
                <Label>{t('serviceDashboard:SOURCE_DESCRIPTION_PREVIEW')}</Label>
                {/* eslint-disable-next-line react/no-danger */}
                <MarkdownWrapper dangerouslySetInnerHTML={{ __html: html }} />
              </InnerGroup>
            )
            : (
              <Field
                name="description"
                type="text"
                component={TextareaV2Field}
                renderLayout={formDecorator(t('serviceDashboard:SOURCE_DESCRIPTION'))}
              />
            )}
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button
              theme="create-secondary"
              onClick={closeModal}
              data-testid="cancel-button"
            >
              <span>{t('serviceDashboard:CANCEL')}</span>
            </Button>
            <Button
              type="submit"
              isLoading={submitting}
              disabled={submitting}
              data-testid="submit-source-button"
            >
              <span>{t('serviceDashboard:SAVE')}</span>
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </form>
    </>
  );
};

SourcesComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

SourcesComponent.defaultProps = {
  error: null,
};

const SourcesForm = reduxForm({
  form: 'source-form',
  enableReinitialize: true,
  validate,
})(SourcesComponent);

const Sources = ({ itemId, ...props }) => {
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(
    (data) => (itemId
      ? dispatch(actions.update(itemId, { ...data.toJS(), priority: getValue(data.get('priority')) }))
      : dispatch(actions.create({ ...data.toJS(), priority: getValue(data.get('priority')) }))),
    [dispatch, itemId],
  );
  const initialValues = useSelector(selectors.getInitialValues);
  return (
    <SourcesForm
      onSubmit={onSubmit}
      initialValues={initialValues}
      {...props}
    />
  );
};

Sources.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default Sources;
