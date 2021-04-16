import styled from 'styled-components';
import { BaseShadow } from 'src/theme/Shadows';

export const StatusIcon = styled.div`
  ${BaseShadow};
`;

export const Name = styled.div`
   display: flex;
   flex-direction: column;
   padding: 3px 14px;
   width: 100%;
   > * {
    word-break: break-word;
   }
`;
