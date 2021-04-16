import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from '@adnz/use-request';
import { useFieldArray } from 'react-final-form-arrays';
import { Col, Row } from 'styled-bootstrap-grid';
import {
  Button, FormGroup, Label, Icons,
} from '@adnz/ui';
import { Field } from 'react-final-form';
import {
  getAccountList,
} from '@adnz/api-ws-salesforce';
import { Option } from 'src/types';
import AsyncSelectField from 'src/components/form/fields/AsyncSelectField';
import SwitchField from 'src/components/form/fields/SwitchField';

const AccountsList: React.FC = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { fields } = useFieldArray('accounts');

  const [, { pending }, loadAccounts] = useRequest({
    apiMethod: getAccountList,
    runOnMount: false,
  });

  const handleLoadAccounts = React.useCallback(
    async (prefix): Promise<Option<string>[]> => {
      const { items } = await loadAccounts({
        prefix,
      });

      return items.map((item) => ({
        value: item.id ?? '',
        label: item.name,
      }));
    },
    [loadAccounts],
  );

  return (
    <>
      <Row>
        <Col md={8}>
          <Label>{t('serviceDashboard:ACCOUNTS')}</Label>
        </Col>
        <Col md={4}>
          <Label>{t('serviceDashboard:ADD_CONTACTS')}</Label>
        </Col>
      </Row>
      {fields.map((fieldName, index) => (
        <FormGroup key={fieldName}>
          <Col md={8}>
            <Field<Option<string>>
              name={`${fieldName}.accountId`}
              render={(props) => (
                <AsyncSelectField
                  isLoading={pending}
                  defaultOptions
                  isClearable
                  loadOptions={handleLoadAccounts}
                  {...props}
                />
              )}
            />
          </Col>
          <Col md={2}>
            <Field<boolean>
              type="checkbox"
              name={`${fieldName}.includeContacts`}
              render={(props) => <SwitchField {...props} />}
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
          <div id="add-accounts-button" className="text-left">
            <Button
              onClick={() => fields.push({ includeContacts: false })}
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

export default AccountsList;
