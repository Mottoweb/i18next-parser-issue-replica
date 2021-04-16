import styled from 'styled-components';
import Media from 'src/theme/Media';

export const TableWrapper = styled.div`
  @media ${Media.mdMin} {
    position: relative;
    overflow: auto;
  }
`;
