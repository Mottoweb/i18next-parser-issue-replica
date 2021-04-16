import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NUMBER_FORMATTER, SWISS_NUMBER_FORMAT } from 'src/constants';
import * as d3 from 'd3';
import { TimeLocaleDefinition } from 'd3-time-format';
import { useTooltip } from '@adnz/use-tooltip';
import en from 'd3-time-format/locale/en-US.json';
import de from 'd3-time-format/locale/de-DE.json';
import ChartContainer from './container';

type DatasetConvertedItem = {
  [date: string]: number,
};

interface DatasetEntry {
  readonly x: string,
  readonly y: number,
}

interface Dataset {
  readonly impressions: DatasetEntry[],
  readonly clicks: DatasetEntry[],
}

interface AreaChartInterface {
  readonly xTicks: number,
  readonly aspectRatio: number,
  readonly dataset: Dataset,
  readonly startDate?: Date,
  readonly endDate?: Date,
}

const margin = {
  top: 10,
  right: 75,
  bottom: 50,
  left: 75,
};

const AreaChart: React.FC<AreaChartInterface> = ({
  xTicks,
  aspectRatio,
  dataset,
  startDate,
  endDate,
}) => {
  const [t, i18n] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const [show, hide] = useTooltip();

  const onMouseOver = React.useCallback(
    (evt: { x: number, y: number }, val: number, date: string, type: string) => show(evt.x + 10, evt.y + 10, (
      <div>
        <div>{type}</div>
        <div>
          <strong>Date: </strong>
          {date}
        </div>
        <div>
          <strong>Value: </strong>
          {SWISS_NUMBER_FORMAT.format(val)}
        </div>
      </div>
    )),
    [show],
  );

  const onMouseOut = React.useCallback(
    () => hide(),
    [hide],
  );

  const container = useRef<HTMLDivElement>(null);

  const tickFormat = React.useCallback(
    (date: Date): string => {
      if (date.getUTCDay() && date.getUTCDate() !== 1) {
        return d3.utcFormat('%d.%m')(date);
      }
      if (date.getUTCDate() !== 1) {
        return d3.utcFormat('%d.%m')(date);
      }
      if (date.getUTCMonth()) {
        return d3.utcFormat('%B')(date);
      }
      return d3.utcFormat('%Y')(date);
    },
    [],
  );

  const formatY = React.useCallback(
    (value: number): string => {
      if (value === 0) {
        return '0';
      } if (value < 1) {
        return value.toFixed(2);
      } if (value < 10 && value % 1 === 0) {
        return value.toFixed(0);
      }
      return `${NUMBER_FORMATTER(value)}`;
    },
    [],
  );

  const impressions: DatasetConvertedItem[] = React.useMemo(
    () => dataset.impressions
      .reduce(
        (map, entry) => [...map, { [entry.x]: entry.y }],
        [] as DatasetConvertedItem[],
      ),
    [dataset],
  );

  const clicks: DatasetConvertedItem[] = React.useMemo(
    () => dataset.clicks
      .reduce(
        (map, entry) => [...map, { [entry.x]: entry.y }],
        [] as DatasetConvertedItem[],
      ),
    [dataset],
  );

  const flatDataset = React.useMemo(
    () => impressions.concat(clicks),
    [impressions, clicks],
  );

  const parse = React.useCallback(
    (val: string): Date => {
      const parsed = d3.utcParse('%Y-%m-%d')(val);
      if (!parsed) {
        throw new Error('unable to parse a date');
      }
      return parsed;
    },
    [],
  );

  const getValue = React.useCallback(
    (d: DatasetConvertedItem): number | undefined => {
      const [value] = d3.values(d);
      return value;
    },
    [],
  );

  useEffect(() => {
    d3.select(container.current).select('svg').remove();
    d3.select(container.current).select('div').remove();
    if (i18n.language === 'de') {
      d3.timeFormatDefaultLocale(de as TimeLocaleDefinition);
    } else {
      d3.timeFormatDefaultLocale(en as TimeLocaleDefinition);
    }

    const width = (container.current?.clientWidth ?? 0) - margin.left - margin.right;
    const fullHeight = width / aspectRatio;
    const height = Math.max(fullHeight, 100);

    const [rangeXdata1, rangeXdata2] = d3.extent(
      flatDataset,
      // @ts-expect-error TODO
      (d) => parse(d3.keys(d)[0]),
    );

    if (!rangeXdata1 || !rangeXdata2) {
      throw new Error('unable to calculate range');
    }

    const domainX = (startDate && endDate) ? [
      new Date(Math.min.apply(null, [+startDate, +rangeXdata1])),
      new Date(Math.max.apply(null, [+endDate, +rangeXdata2])),
    ] : [rangeXdata1, rangeXdata2];

    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = domainX[0];
    const secondDate = domainX[1];
    const diffDays = Math.round(Math.abs(((firstDate?.getTime() ?? 0) - (secondDate?.getTime() ?? 0)) / (oneDay)));

    const x = d3.scaleUtc()
      .range([0, width])
      .domain(domainX);

    const impressionsDomainY = [
      0,
      // @ts-expect-error TODO
      (d3.max(impressions.map(getValue)) ?? 0) * 1.1,
    ];

    const clicksDomainY = [
      0,
      // @ts-expect-error TODO
      (d3.max(clicks.map(getValue)) ?? 0) * 3,
    ];

    const impressionsY = d3.scaleLinear()
      .range([height, 0])
      .domain(impressionsDomainY);

    const clicksY = d3.scaleLinear()
      .range([height, 0])
      .domain(clicksDomainY);

    const xAxis = d3.axisBottom<Date>(x)
      .ticks(diffDays < 10 ? diffDays : null)
      .tickFormat(tickFormat);

    const formatDate = d3.utcFormat('%d %b %Y, %A');

    const yImpressionsAxis = d3.axisLeft<number>(impressionsY)
      .ticks(xTicks)
      .tickFormat(formatY);

    const yClicksAxis = d3.axisRight<number>(clicksY)
      .ticks(xTicks)
      .tickFormat(formatY);

    const impressionsLine = d3.line<DatasetConvertedItem>()
    // @ts-expect-error TODO
      .x((d) => (x(parse(d3.keys(d)[0])) ?? 0))
      // @ts-expect-error TODO
      .y((d) => (impressionsY(d3.values(d)[0]) ?? 0));

    const impressionsArea = d3.area<DatasetConvertedItem>()
    // @ts-expect-error TODO
      .x((d) => (x(parse(d3.keys(d)[0])) ?? 0))
      .y0(height)
      // @ts-expect-error TODO
      .y1((d) => (impressionsY(d3.values(d)[0]) ?? 0));

    const clicksLine = d3.line<DatasetConvertedItem>()
    // @ts-expect-error TODO
      .x((d) => (x(parse(d3.keys(d)[0])) ?? 0))
      // @ts-expect-error TODO
      .y((d) => (clicksY(d3.values(d)[0]) ?? 0));

    const clicksArea = d3.area<DatasetConvertedItem>()
    // @ts-expect-error TODO
      .x((d) => (x(parse(d3.keys(d)[0])) ?? 0))
      .y0(height)
      // @ts-expect-error TODO
      .y1((d) => (clicksY(d3.values(d)[0]) ?? 0));

    const svg = d3.select(container.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const focus = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    focus.append('g')
      .attr('class', 'xaxis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')
      .attr('y', 18);

    focus.append('g')
      .attr('class', 'yaxis impressions')
      .call(yImpressionsAxis);

    focus.append('g')
      .attr('class', 'yaxis clicks')
      .attr('transform', `translate(${width}, 0)`)
      .call(yClicksAxis);

    focus
      .select<d3.BaseType>('.xaxis')
      .selectAll('.tick > text')
      .style('font-weight', function setBold(this: d3.BaseType) {
        // eslint-disable-next-line react/no-this-in-sfc
        return (this as Element)?.textContent?.split('')[2] === '.' ? '' : 'bold';
      });

    focus.append('path')
      .datum(impressions)
      .attr('class', 'path impressions')
      .attr('d', impressionsArea);

    focus.append('path')
      .datum(impressions)
      .attr('class', 'line impressions')
      .attr('d', impressionsLine);

    focus.append('g')
      .selectAll('.dot.impressions')
      .data(impressions)
      .enter()
      .append('circle')
      .attr('class', 'dot impressions')
      // @ts-expect-error TODO
      .attr('cx', (d) => (x(parse(d3.keys(d)[0])) ?? 0))
      // @ts-expect-error TODO
      .attr('cy', (d) => (impressionsY(d3.values(d)[0]) ?? 0))
      .attr('r', () => 4)
      .on('mouseover', function handleMouseOver(d) {
        // @ts-expect-error TODO
        onMouseOver(d3.event, d3.values(d)[0], formatDate(parse(d3.keys(d)[0])), t('serviceDashboard:IMPRESSIONS'));
        d3.select(this).attr('r', 6);
      })
      .on('mouseout', function handleMouseOut() {
        onMouseOut();
        d3.select(this).attr('r', 4);
      });

    focus.append('path')
      .datum(clicks)
      .attr('class', 'path clicks')
      .attr('d', clicksArea);

    focus.append('path')
      .datum(clicks)
      .attr('class', 'line clicks')
      .attr('d', clicksLine);

    focus.append('g')
      .selectAll('.dot')
      .data(clicks)
      .enter()
      .append('circle')
      .attr('class', 'dot clicks')
      // @ts-expect-error TODO
      .attr('cx', (d) => (x(parse(d3.keys(d)[0])) ?? 0))
      // @ts-expect-error TODO
      .attr('cy', (d) => (clicksY(d3.values(d)[0]) ?? 0))
      .attr('r', () => 4)
      .on('mouseover', function handleMouseOver(d) {
        // @ts-expect-error TODO
        onMouseOver(d3.event, d3.values(d)[0], formatDate(parse(d3.keys(d)[0])), t('serviceDashboard:CLICKS'));
        d3.select(this).attr('r', 6);
      })
      .on('mouseout', function handleMouseOut() {
        onMouseOut();
        d3.select(this).attr('r', 4);
      });

    focus.append('text')
      .attr('class', 'axis-title impressions')
      .attr('transform', `translate(-45, ${(height / 2)})rotate(-90)`)
      .text(t('serviceDashboard:IMPRESSIONS'));

    if (impressions.length === 1) {
      focus.append('rect')
      // @ts-expect-error TODO
        .attr('x', (x(parse(d3.keys(impressions[0])[0])) ?? 0) - 1)
        // @ts-expect-error TODO
        .attr('y', impressionsY(d3.values(impressions[0])[0]) ?? 0)
        .attr('width', '2')
        // @ts-expect-error TODO
        .attr('height', height - (impressionsY(d3.values(impressions[0])[0]) ?? 0))
        .attr('class', 'path impressions');
    }

    if (clicks.length === 1) {
      focus.append('rect')
      // @ts-expect-error TODO
        .attr('x', (x(parse(d3.keys(clicks[0])[0])) ?? 0) - 1)
        // @ts-expect-error TODO
        .attr('y', clicksY(d3.values(clicks[0])[0]) ?? 0)
        .attr('width', '2')
        // @ts-expect-error TODO
        .attr('height', height - (clicksY(d3.values(clicks[0])[0]) ?? 0))
        .attr('class', 'path clicks');
    }

    focus.append('text')
      .attr('class', 'axis-title clicks')
      .attr('transform', `translate(${width + 55}, ${(height / 2)})rotate(-90)`)
      .text(t('serviceDashboard:CLICKS'));
  }, [dataset, startDate, endDate]);

  return (
    <ChartContainer ref={container} />
  );
};

export default React.memo(AreaChart);
