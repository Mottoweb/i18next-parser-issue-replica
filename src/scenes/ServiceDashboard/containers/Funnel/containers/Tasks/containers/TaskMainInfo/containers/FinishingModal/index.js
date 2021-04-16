import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ReactSelectV2Field, { getValue } from 'src/components/ReactSelectV2Field';
import FieldDecorator, { formDecorator } from 'src/components/FieldDecorator';
import {
  Modal, Button, ButtonGroup, FormGroup, Label, Radio,
} from '@adnz/ui';
import CheckboxField from 'src/components/form/fields/CheckboxField';

import {
  Row,
  Col,
} from 'styled-bootstrap-grid';
import {
  Field,
  reduxForm,
} from 'redux-form/immutable';
import { useHistory } from 'react-router-dom';
import TextareaField from 'src/components/TextareaV2Field';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import * as actions from '../../../../actions';
import * as selectors from '../../../../selectors';

const FormModalComponent = ({
  itemId,
  submitting,
  handleSubmit,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();
  const isShownAll = useSelector(selectors.getIsAllCampaignsShownOnFinish);
  const outcomeOptions = useSelector(selectors.getFinishOptionsWithoutOffer);
  const withOfferSelected = useSelector(selectors.getWithOfferSelected);
  const submitIsDisabled = useSelector(selectors.getSubmitIsDisabled);
  const dispatch = useDispatch();
  const handleClose = React.useCallback(
    () => dispatch(actions.closeFinishModal()),
    [dispatch],
  );
  const handleWithOffer = React.useCallback(
    () => dispatch(actions.showWithOfferFinishing()),
    [dispatch],
  );
  const handleWithoutOffer = React.useCallback(
    () => dispatch(actions.showWithoutOfferFinishing()),
    [dispatch],
  );
  const onShowAllToggle = React.useCallback(
    (evt) => dispatch(actions.toggleShowAllCampaign(evt.target.checked)),
    [dispatch],
  );
  const { execute: loadCampaigns } = useEffectWithToken(
    (token, filter) => dispatch(actions.getLabelValueFinishingCampaigns({ filter }, token)),
    [],
  );
  return (
    <Modal
      isOpen
      onRequestClose={handleClose}
      title={t('serviceDashboard:FINISH_TASK_TITLE')}
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <FormGroup>
            <Col xs={12}>
              <ButtonGroup align="space-between">
                <Radio.InlineGroup>
                  <Label>
                    <Radio
                      checked={withOfferSelected}
                      onChange={handleWithOffer}
                    />
                    <span>{t('serviceDashboard:WITH_OFFER')}</span>
                  </Label>
                  <Label>
                    <Radio
                      checked={!withOfferSelected}
                      onChange={handleWithoutOffer}
                    />
                    <span>{t('serviceDashboard:WITHOUT_OFFER')}</span>
                  </Label>
                </Radio.InlineGroup>
                <Button
                  id="create-new-offer-button"
                  onClick={() => history.push(`/buy-side/campaigns/OFFERED/tasks/${itemId}/new-order/`)}
                >
                  {t('serviceDashboard:NEW_OFFER')}
                </Button>
              </ButtonGroup>
            </Col>
          </FormGroup>
          {!withOfferSelected && (
            <Row>
              <Col md={6}>
                <Field
                  name="outcome"
                  component={ReactSelectV2Field}
                  renderLayout={formDecorator(t('serviceDashboard:SELECT_OUTCOME'))}
                  options={outcomeOptions}
                />
              </Col>
            </Row>
          )}
          {!!withOfferSelected && (
            <FormGroup>
              <Col md={6}>
                <Field
                  key={isShownAll}
                  name="campaignId"
                  component={ReactSelectV2Field}
                  renderLayout={formDecorator(t('serviceDashboard:CAMPAIGN'), { group: false })}
                  ignoreAccents={false}
                  allowCreate={false}
                  isClearable
                  defaultOptions
                  loadOptions={loadCampaigns}
                />
              </Col>
              <Col md={6}>
                <Label
                  type="inline-checkbox-inform"
                >
                  <Field
                    name="isShownAll"
                    type="checkbox"
                    component={CheckboxField}
                    onChange={onShowAllToggle}
                    square
                  />
                  <span>{t('serviceDashboard:SHOW_ALL_ACCOUNT_CAMPAIGNS')}</span>
                </Label>
              </Col>
            </FormGroup>
          )}
          <Label>{t('serviceDashboard:MESSAGE')}</Label>
          <Field
            name="comment"
            type="text"
            component={TextareaField}
            renderLayout={(props) => (<FieldDecorator {...props} />)}
            placeholder={t('serviceDashboard:MESSAGE')}
          />
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button
              theme="create-secondary"
              onClick={handleClose}
            >
              {t('serviceDashboard:CLOSE')}
            </Button>
            <Button
              type="submit"
              disabled={submitIsDisabled || submitting}
              isLoading={submitting}
            >
              {t('serviceDashboard:SUBMIT')}
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

FormModalComponent.propTypes = {
  itemId: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

const FormModalForm = reduxForm({
  form: 'finish-task-form',
  enableReinitialize: true,
})(FormModalComponent);

const FormModalInner = ({ itemId }) => {
  const dispatch = useDispatch();
  const initialValues = useSelector(selectors.getFinishTaskInitialValue);
  const onSubmit = React.useCallback(
    (data) => dispatch(actions.finishTask(
      getValue(data.get('outcome')),
      data.get('comment'),
      getValue(data.get('campaignId')),
    )),
    [dispatch],
  );
  return (
    <FormModalForm
      itemId={itemId}
      initialValues={initialValues}
      onSubmit={onSubmit}
    />
  );
};

FormModalInner.propTypes = {
  itemId: PropTypes.string.isRequired,
};

const FormModal = ({ itemId }) => {
  const isModalOpened = useSelector(selectors.isFinishingModalOpened);
  if (!isModalOpened) {
    return null;
  }
  return (
    <FormModalInner itemId={itemId} />
  );
};

FormModal.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default FormModal;
