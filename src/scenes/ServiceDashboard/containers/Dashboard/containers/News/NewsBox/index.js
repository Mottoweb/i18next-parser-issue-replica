import React from 'react';
import {
  Col,
  Row,
} from 'styled-bootstrap-grid';
import { useTranslation } from 'react-i18next';
import DateTime from 'src/components/DateTime';
import { fromDateTimeType } from '@adnz/api-helpers';

const NewsBox = ({
  news,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  if (!news) {
    return null;
  }
  return (
    <div className="item">
      <Row>
        {!!news.get('imageLink')
          && (
          <Col sm={2} className="img-box hidden-xs">
            <a href={news.get('link')}><img src={news.get('imageLink')} alt={news.get('title')} /></a>
          </Col>
          )}
        <Col sm={10} className="content-news">
          <a href={news.get('link')} className="rss-title">
            <h2 className="news-title">{news.get('title')}</h2>
          </a>
          <div className="author-date">
            <DateTime showLocal value={fromDateTimeType(news.get('date'))} />
          </div>
          <p className="text">
            {news.get('description')}
          </p>
          <a href={news.get('link')}>{t('serviceDashboard:READ_ARTICLE')}</a>
        </Col>
      </Row>
    </div>
  );
};

export default NewsBox;
