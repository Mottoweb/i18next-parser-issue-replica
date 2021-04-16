import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import SectionTitle from 'src/components/SectionTitle';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import LoaderComponent from 'src/components/Loader';
import ErrorComponent from 'src/components/Error';
import * as selectors from './selectors';
import * as actions from './actions';
import NewsBox from './NewsBox';

const News = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const news = useSelector(selectors.news);
  const dispatch = useDispatch();
  const { loading, error } = useEffectWithToken(
    (token) => dispatch(actions.getNews(token)),
    [],
    true,
  );
  if (loading) {
    return <LoaderComponent />;
  }
  if (error) {
    return <ErrorComponent title={error.message} />;
  }
  return (
    <>
      <SectionTitle>{t('serviceDashboard:LATEST_BLOG_ARTICLES')}</SectionTitle>
      <div id="news-row-container" className="news-row">
        {news.map((newsItem) => (
          <NewsBox key={newsItem.get('id')} news={newsItem} />
        ))}
      </div>
    </>
  );
};

export default News;
