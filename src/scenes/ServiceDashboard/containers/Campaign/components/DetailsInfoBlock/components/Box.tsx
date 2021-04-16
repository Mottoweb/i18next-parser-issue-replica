import React from 'react';
import styled from 'styled-components';
import Colors from 'src/theme/Colors';

const Container = styled.div`
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: solid 1px ${Colors['white-two']};
  :first-child {
    border-left: solid 1px ${Colors['white-two']};
  }
`;

const BodyContainer = styled.div`
  min-height: 50px;
`;

const Title = styled.div`
  margin: 6px 0;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-weight: 300;
  text-align: center;
  color: ${Colors['greyish-brown']};
`;

interface BoxProps {
  body?: React.ReactNode,
  title: string,
  className?: string,
  icon?: React.ReactNode,
  footer?: React.ReactNode,
}

const Box:React.FC<BoxProps> = ({
  body = null, title = '', icon = null, footer = null, className = '',
}) => (
  <Container className={className}>
    {icon}
    <Title>{title}</Title>
    <BodyContainer>
      {body}
    </BodyContainer>
    {footer}
  </Container>
);

export default Box;
