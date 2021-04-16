import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ellipsize from 'ellipsize';
import styled from 'styled-components';
import EmptyChart, { EmptyChartContainer } from 'src/components/charts/EmptyChart';
import Colors from 'src/theme/Colors';

const ChartContainer = styled.div`
  width: 100%;
  svg {
    width: 100%;
  }

  .yAxis {
    .domain{
      display: none;
    }
    .tick > line {
      display: none;
    }
  }
`;

const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
};

const BarsChart = (props) => {
  const container = useRef(null);
  const {
    formatText,
    onMouseOver,
    onMouseOut,
    onAlertOver,
    onAlertOut,
    type,
    param,
    color,
    colorActive,
    domainXOnMouseOver,
    domainXOnMouseOut,
    ellipsisSize,
    dataset: datasetRaw,
  } = props;

  const isEmpty = datasetRaw.size === 0;

  const draw = () => {
    d3.select(container.current).select('svg').remove();

    const dataset = props.dataset.toJS();
    const width = container.current.clientWidth - margin.left - margin.right;
    const height = width / props.aspectRatio;
    const legend = 80;

    const x = d3.scaleBand()
      .rangeRound([0, (dataset.length * 100 > width)
        ? ((dataset.length * width) / dataset.length)
        : (dataset.length * 100)])
      .domain(dataset.map((d) => d.name))
      .padding(0.2);

    const svg = d3.select(container.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    if (props.visibleYAxis) {
      svg.attr('width', width + margin.left);
    }

    const focus = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    if (props.visibleYAxis) {
      focus.attr('transform', `translate(${margin.left * 2}, ${margin.top})`);
    }

    focus
      .append('g')
      .attr('class', 'yAxis');

    focus
      .append('g')
      .attr('class', 'xAxis')
      .attr('transform', `translate(0, ${height})`);

    const linesData = d3.range(0, 5);

    focus
      .append('g')
      .selectAll('.line__grid-thin')
      .data(linesData)
      .enter()
      .append('line')
      .attr('class', 'line__grid line__grid-thin')
      .attr('x1', 0)
      .attr('y1', (d) => ((height - legend) / 5) * d)
      .attr('x2', width)
      .attr('y2', (d) => ((height - legend) / 5) * d);

    const defs = focus
      .append('defs');

    const filter = defs
      .append('filter')
      .attr('id', 'audienzz-divisions-drop-shadow')
      .attr('width', '130%')
      .attr('height', '130%');

    filter
      .append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 3);

    filter
      .append('feOffset')
      .attr('dx', 1)
      .attr('dy', 1)
      .attr('result', 'offsetBlur');

    const feComponentTransfer = filter
      .append('feComponentTransfer');

    feComponentTransfer
      .append('feFuncA')
      .attr('type', 'linear')
      .attr('slope', 0.4);

    const feMerge = filter
      .append('feMerge');

    feMerge.append('feMergeNode');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    const t = d3.transition()
      .duration(500);

    const y = d3.scaleLinear()
      .range([0, height - legend])
      .domain([0, d3.max(dataset, (d) => d.value) * 1.1]);

    const xAxis = focus.select('.xAxis')
      .call(d3.axisBottom().scale(x));

    xAxis
      .selectAll('text')
      .attr('transform', 'translate(-10, -35) rotate(-45)')
      .text((text) => (ellipsize ? ellipsize(text, ellipsisSize) : text));

    if (domainXOnMouseOver && domainXOnMouseOut) {
      xAxis.selectAll('text')
        .on('mouseover', (text) => domainXOnMouseOver(d3.event, text))
        .on('mouseout', () => domainXOnMouseOut());
    }

    xAxis.selectAll('.tick > line')
      .attr('transform', 'translate(0, -75)')
      .attr('y2', '35')
      .attr('stroke-dasharray', '2, 4');

    xAxis.selectAll('path')
      .style('opacity', 0);

    if (props.visibleYAxis) {
      const yValues = d3.scaleLinear()
        .range([0, height - legend])
        .domain([d3.max(dataset, (d) => d.value) * 1.1, 0]);

      focus.select('.yAxis')
        .call(d3.axisLeft().scale(yValues).ticks(props.numberYTicks).tickFormat((d) => props.formatText({
          type: props.param,
          value: d,
        })));
    }

    const className = `rect__${type === 'CLICK' ? 'clicks' : 'impressions'}`;

    const bandwidth = x.bandwidth();

    const bars = focus
      .selectAll(`.${className}`)
      .data(dataset, (d) => d.name);

    const barsEnter = bars
      .enter()
      .append('g')
      .attr('class', 'bc-bars__group')
      .append('rect')
      .attr('class', className)
      .attr('fill', color)
      .attr('x', (d) => x(d.name))
      .attr('y', height - legend)
      .attr('height', 0)
      .attr('width', bandwidth)
      .style('filter', 'url(#audienzz-divisions-drop-shadow)');

    bars
      .merge(barsEnter)
      .transition(t)
      .attr('y', (d) => height - legend - y(d.value))
      .attr('height', (d) => y(d.value));

    focus
      .selectAll('.bc-bars__group')
      .append('text')
      .attr('class', 'percent-phone-fix')
      .attr('transform', (d) => {
        const xVal = x(d.name) + (bandwidth / 2);
        const yVal = (y(d.value) < 30) ? (height - legend - y(d.value) - 5) : (height - legend - 15);
        return `translate(${xVal}, ${yVal})`;
      })
      .attr('text-anchor', 'middle')
      .style('fill', (d) => ((y(d.value) >= 30) ? '#fff' : '#000'))
      .text(formatText);

    if (type === 'CTR') {
      const alerts = focus
        .selectAll('.bc-bars__group')
        .append('g');

      alerts
        .attr('class', 'graph-count-info')
        .style('cursor', 'pointer')
        .on('mouseover', () => {
          onAlertOver(d3.event);
        })
        .on('mouseout', () => {
          onAlertOut(d3.event);
        });

      alerts
        .append('circle')
        .attr('class', 'stroke')
        .attr('cx', (d) => x(d.name) + (bandwidth / 2))
        .attr('cy', (d) => {
          const a = (y(d.value) < 30) ? (height - legend - y(d.value) - 5) : (height - legend - 15);
          // show above text
          return a - 30;
        })
        .attr('r', 10)
        .style('display', (d) => ((d.CLICK <= 10) ? 'block' : 'none'))
        .style('fill', '#fff')
        .style('stroke', '#787878');

      alerts
        .append('circle')
        .attr('class', 'fill')
        .style('fill', '#787878')
        .style('display', (d) => ((d.CLICK <= 10) ? 'block' : 'none'))
        .attr('r', 1)
        .attr('cx', (d) => x(d.name) + (bandwidth / 2))
        .attr('cy', (d) => {
          const a = (y(d.value) < 30) ? (height - legend - y(d.value) - 5) : (height - legend - 15);
          // show above text
          return a - 34;
        });

      alerts
        .append('rect')
        .attr('class', 'fill')
        .style('fill', '#787878')
        .style('display', (d) => ((d.CLICK <= 10) ? 'block' : 'none'))
        .attr('height', '6px')
        .attr('width', '1px')
        .attr('transform', (d) => {
          const a = (x(d.name) + (bandwidth / 2)) - 0.5;
          const b = (y(d.value) < 30) ? ((height - legend - y(d.value) - 5) - 31) : ((height - legend - 15) - 31);
          return `translate(${a}, ${b})`;
        });
    }

    barsEnter.on('mouseover', function handleMouseOver(d) {
      if (d.type === 'website') {
        onMouseOver(d3.event, d.name, d.value, d.param);
      } else {
        onMouseOver(d3.event, d);
      }

      d3.select(this).attr('fill', colorActive);
    });
    barsEnter.on('mouseout', function handleMouseOut() {
      onMouseOut();
      d3.select(this).attr('fill', color);
    });
  };

  useEffect(() => {
    if (!isEmpty) {
      draw();
    } else {
      d3.select(container.current).select('svg').remove();
    }
  }, [type, param, isEmpty]);

  return (
    <EmptyChartContainer>
      <ChartContainer ref={container} />
      {isEmpty && <EmptyChart />}
    </EmptyChartContainer>
  );
};

BarsChart.propTypes = {
  dataset: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    type: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.number,
  })).isRequired,
  size: PropTypes.shape({
    width: PropTypes.number,
  }).isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseOut: PropTypes.func.isRequired,
  onAlertOver: PropTypes.func.isRequired,
  onAlertOut: PropTypes.func.isRequired,
  formatText: PropTypes.func.isRequired,
  color: PropTypes.string,
  colorActive: PropTypes.string,
  aspectRatio: PropTypes.number,
  type: PropTypes.string.isRequired,
  visibleYAxis: PropTypes.bool,
  param: PropTypes.string.isRequired,
  numberYTicks: PropTypes.number,
  ellipsisSize: PropTypes.number,
  domainXOnMouseOver: PropTypes.func.isRequired,
  domainXOnMouseOut: PropTypes.func.isRequired,
};

BarsChart.defaultProps = {
  aspectRatio: 0.6,
  visibleYAxis: false,
  numberYTicks: null,
  ellipsisSize: 16,
  color: Colors['greyish-teal'],
  colorActive: Colors['greyish-teal'],
};

export default React.memo(BarsChart);
