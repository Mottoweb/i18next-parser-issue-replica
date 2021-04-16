import styled from 'styled-components';
import Colors from 'src/theme/Colors';

export const Id = styled.div`
  font-family: Roboto, sans-serif;
  font-size: 10px;
  color: ${Colors['dark-sky-blue']};
`;

export const Title = styled.div`
  font-family: Roboto, sans-serif;
  font-size: 22px;
  font-weight: 300;
  color: ${Colors['greyish-brown']};
`;

export const Roles = styled.div`
  font-family: Roboto, sans-serif;
  font-size: 10px;
  color: ${Colors['greyish-brown']};
  & span:not(:last-child)::after {
    content: ", ";
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ColumnContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
`;
