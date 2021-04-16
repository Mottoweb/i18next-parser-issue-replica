import styled from 'styled-components';
import Colors from 'src/theme/Colors';
import Media from 'src/theme/Media';

export const Statistics = styled.div`
  display: flex;
  justify-content: stretch;
  flex-wrap: wrap;
  width: 100%;
  text-align: center;
`;

export const StatisticsItem = styled.div`
  flex: auto;
  padding: 10px 15px;
  border-right: 1px solid ${Colors['white-two']};
  :first-child {
    border-left: 1px solid ${Colors['white-two']};
  }
  @media ${Media.xsMax} {
    width: calc(100%/3);
    border-top: 1px solid ${Colors['white-two']};
  }
  :nth-child(4) {
    border-left: 1px solid ${Colors['white-two']};
  }
`;

export const StatisticsTitle = styled.p`
  font-size: 16px;
  margin: 3px 0;
`;

export const StatisticsValue = styled.p`
  font-size: 16px;
  margin: 0;
  color: ${Colors.Jaffa};
`;
