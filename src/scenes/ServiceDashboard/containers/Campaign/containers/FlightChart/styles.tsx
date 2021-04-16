import styled from 'styled-components';
import { Table } from '@adnz/ui';
import Colors from 'src/theme/Colors';

export const InTableContainer = styled.div`
  max-height: 310px;
  position: relative;
  overflow: auto;
`;

export const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 8px 66px;
`;

export const InTableSortBtn = styled.span<{ active?: boolean }>`
  cursor: pointer;
  color: ${({ active }) => active && Colors.Jaffa};
`;

export const InTableThead = styled.thead`
  th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #fff;
    > div {
      min-height: 45px;
      border-top: 1px solid ${Colors.Gallery};
      border-bottom: 1px solid ${Colors.Gallery};
      white-space: nowrap;
    }
    :last-child > div {
      justify-content: flex-end;
    }
  }
`;

export const InTableRow = styled(Table.Tr)`
  text-align: left;
  > td {
    padding: 8px 14px;
    :last-child {
      text-align: right;
    }
  }
`;
