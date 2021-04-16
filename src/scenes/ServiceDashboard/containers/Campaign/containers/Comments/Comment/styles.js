import Colors from 'src/theme/Colors';
import styled from 'styled-components';

export const CommentTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CommentInfo = styled.div`
  font-size: 12px;
  color: ${Colors['brown-grey-two']};
  text-align: right;
`;

export const CommentBody = styled(CommentTitle)`
  margin-top: 4px;
  word-break: break-word;
  white-space: pre-wrap;
`;
