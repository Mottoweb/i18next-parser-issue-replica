import styled from 'styled-components';
import { Table, Label } from '@adnz/ui';
import Colors from 'src/theme/Colors';

export const LeadsTableContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
  width: 100%;
  th {
    border-bottom: 1px solid ${Colors.Gallery};
  }
`;

export const LeadsEditorCheckboxRow = styled(Label)`
  &>div{
    margin-right: 10px;
  }
  i{
    margin-left: 10px;
    color: ${Colors['very-light-pink-four']};
  }
`;

export const InTableRow = styled(Table.Tr)`
  > td {
    padding: 8px 14px;
  }
  :not(:last-child) {
    > td {
      border-bottom: 1px solid ${Colors.Gallery};
    }
  }
`;
