import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import { Button, FormGroup, Icons } from '@adnz/ui';
import { Col, Row } from 'styled-bootstrap-grid';
import TextField from 'src/components/form/fields/TextField';

const StatusFields:React.FC<{ field: string }> = ({ field }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { fields } = useFieldArray(field);
  return (
    <>
      <Row>
        <Col md={12}>
          <h3>{t('serviceDashboard:CONTACT_STATUS')}</h3>
        </Col>
      </Row>
      {fields.map((fieldName, index) => (
        <FormGroup>
          <Col md={6} data-testid="contact-status-field">
            <Field<string>
              name={fieldName}
              render={(props) => (
                <TextField {...props} />
              )}
            />
          </Col>
          <Col md={6}>
            <Button
              id="delete-item-button"
              onClick={() => fields.remove(index)}
              icon
            >
              <Icons.Trash />
            </Button>
          </Col>
        </FormGroup>
      ))}
      <Row>
        <Col>
          <div id="add-status-button" className="text-left">
            <Button
              onClick={() => fields.push('')}
              square
            >
              <Icons.Plus color="#fff" size={20} />
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default StatusFields;
