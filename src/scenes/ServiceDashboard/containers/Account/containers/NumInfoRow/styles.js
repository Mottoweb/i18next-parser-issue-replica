import styled from 'styled-components';
import Colors from 'src/theme/Colors';
import Media from 'src/theme/Media';

export const NumInfoRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const NumContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0 40px;
  flex: 1;
  position: relative;
  &:first-child {
    border-left: solid 1px #f5f5f5;
  }
  border-right: solid 1px #f5f5f5;
  cursor: pointer;
  @media ${Media.xsMin} {
    padding: 20px 0;
  }
`;

export const Title = styled.div`
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-weight: 300;
  text-align: center;
  color: ${Colors['greyish-brown']};
`;

export const Number = styled.div`
  font-family: Roboto, sans-serif;
  font-size: 22px;
  text-align: center;
  color: ${Colors['greyish-brown']};
  margin-top: 9px;
`;

export const Note = styled.div`
  color: ${Colors['brown-grey-two']};
  font-size: 11px;
  position: absolute;
  bottom: 4px;
  left: 0;
  width: 100%;
  text-align: center;
`;
