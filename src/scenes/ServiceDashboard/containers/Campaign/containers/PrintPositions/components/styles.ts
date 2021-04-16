import styled, { keyframes } from 'styled-components';
import Colors from 'src/theme/Colors';
import { ShadowTuna } from 'src/theme/Shadows';

export const WrapperLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 195px;
  background: ${Colors.alabaster};
`;

export const Item = styled.div`
  cursor: pointer;
  padding: 10px;
  background: #fff;
  margin: 5px;
  border-radius: 4px;
  flex: 0 0 calc((100% / 5) - 10px);
  ${ShadowTuna};
  > img {
    max-width: 100%;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  background: ${Colors.alabaster};
  padding: 5px;
  min-height: 195px;
`;

const fadeIn = () => keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const List = styled.div<{ isLoaded?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  animation: ${({ isLoaded }) => isLoaded && fadeIn} 500ms ease;
  width: 100%;
`;

export const Message = styled.span`
  font-weight: 600;
`;
