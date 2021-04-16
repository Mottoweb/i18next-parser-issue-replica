import styled from 'styled-components';
import Media from 'src/theme/Media';

export const ToolbarContainer = styled.div`
  display: flex;
  font-size: 14px;
  font-weight: 400;
  @media ${Media.smMax} {
    flex-direction: column;
    & > * {
      margin-top: 5px;
    }
  }
`;
