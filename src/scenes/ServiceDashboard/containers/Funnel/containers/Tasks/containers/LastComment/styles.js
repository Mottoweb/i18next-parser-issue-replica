import styled from 'styled-components';
import Colors from 'src/theme/Colors';

export const CommentTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CommentInfo = styled.div`
  width: 50%;
  font-size: 12px;
  color: ${Colors['brown-grey-two']};
  text-align: right;
`;

export const CommentBody = styled.div`
  margin-top: 4px;
  word-break: break-word;
  white-space: pre-wrap;
`;
