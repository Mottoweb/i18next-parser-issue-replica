import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from '@adnz/use-request';
import { useFieldArray, FieldArrayRenderProps } from 'react-final-form-arrays';
import { Col, Row } from 'styled-bootstrap-grid';
import {
  Button, FormGroup, Label, Icons,
} from '@adnz/ui';
import { Field } from 'react-final-form';
import {
  getContacts,
} from '@adnz/api-ws-salesforce';
import { Option } from 'src/types';
import AsyncSelectField from 'src/components/form/fields/AsyncSelectField';

const ContactsList: React.FC = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { fields }: FieldArrayRenderProps<Option<string>, HTMLElement> = useFieldArray('contacts');

  const [, { pending }, loadContacts] = useRequest({
    apiMethod: getContacts,
    runOnMount: false,
  });

  const handleLoadContacts = React.useCallback(
    async (filter): Promise<Option<string>[]> => {
      const { items } = await loadContacts({
        filter,
        limit: 20,
        page: 0,
      });

      return items.map((item) => ({
        value: item.id ?? '',
        label: item.name ?? '',
      }));
    },
    [loadContacts],
  );

  return (
    <>
      <Row>
        <Col md={8}>
          <Label>{t('serviceDashboard:CONTACTS')}</Label>
        </Col>
      </Row>
      {fields.map((fieldName, index) => (
        <FormGroup key={fieldName}>
          <Col md={10}>
            <Field<Option<string>>
              name={`${fieldName}.contactId`}
              render={(props) => (
                <AsyncSelectField
                  isLoading={pending}
                  defaultOptions
                  isClearable
                  loadOptions={handleLoadContacts}
                  {...props}
                />
              )}
            />
          </Col>
          <Col md={2}>
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
          <div id="add-contacts-button" className="text-left">
            <Button
              onClick={() => fields.push({ label: '', value: '' })}
              square
            >
              <Icons.Plus size={20} color="#fff" />
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ContactsList;
