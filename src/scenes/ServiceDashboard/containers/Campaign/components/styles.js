import styled from 'styled-components';
import Media from 'src/theme/Media';

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media ${Media.mdMin} {
    flex-direction: row;
  }
  > * {
    @media ${Media.mdMin} {
      margin-top: 0 !important;
      min-width: calc(50% - 2.5px);
      max-width: calc(50% - 2.5px);
    }
    &:first-child {
      @media ${Media.mdMin} {
        margin-right: 5px;
      }
    }
  }
`;

export const InfoText = styled.pre`
  white-space: pre-wrap;
  background: transparent;
  border: none;
  font-family: inherit;
  overflow: hidden;
  padding: 0;
  margin: 0;
  word-break: break-word;
`;
