import styled from 'styled-components';
import CampaignChartContainer from 'src/components/CampaignChartContainer';
import Colors from 'src/theme/Colors';

const ChartContainer = styled.div`
  width: 100%;

  ${/* sc-custom 'div' */CampaignChartContainer} & {
    min-width: 768px;
  }

  svg {
    width: 100%;
  }

  .clicks {
   &.axis-title {
    font-size: 18px;
    fill: ${Colors['greyish-teal']};
    text-anchor: middle;
  }

  &.line {
    fill: none;
    stroke: ${Colors['greyish-teal']};
    stroke-width: 1.6px;
  }

  &.grid line {
    stroke: ${Colors['greyish-teal']};
    stroke-opacity: 0.3;
  }

  &.grid path {
    stroke-width: 0;
  }

  &.path {
    fill: ${Colors['greyish-teal']};
    opacity: 0.1;
  }

  &.dot {
    stroke: ${Colors['greyish-teal']};
    stroke-width: 2px;
    fill: #fff;
    &:hover {
      cursor: pointer;
    }
  }
  }
  .impressions {
  &.axis-title {
    font-size: 18px;
    fill: ${Colors.squash};
    text-anchor: middle;
  }

  &.line {
    fill: none;
    stroke: ${Colors.squash};
    stroke-width: 1.6px;
  }

  &.grid line {
    stroke: ${Colors.squash};
    stroke-opacity: 0.3;
  }

  &.grid path {
    stroke-width: 0;
  }

  &.path {
    fill: ${Colors.squash};
    opacity: 0.1;
  }

  &.dot {
    stroke: ${Colors.squash};
    stroke-width: 2px;
    fill: #fff;
    &:hover {
      cursor: pointer;
    }
  }
  }

  .yaxis, .xaxis {
    color: ${Colors['greyish-brown']};
    font-size: 10px;
    stroke-width: 1px;
    .domain {
      display: none;
    }
    .tick > line {
      display: none;
    }
  }
`;

export default ChartContainer;
