import styled from 'styled-components';
import Media from 'src/theme/Media';

export const ControlsWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  @media ${Media.mdMin} {
    align-items: center;
  }
  @media ${Media.smMax} {
    flex-direction: column;
    >*:not(:last-child) {
      margin-bottom: 10px;
    }
  }
`;

export const HiddenInput = styled.input`
  cursor: pointer;
  height: 100%;
  position:absolute;
  top: 0;
  right: 0;
  z-index: 99;
  opacity: 0;
  -moz-opacity: 0;
`;
