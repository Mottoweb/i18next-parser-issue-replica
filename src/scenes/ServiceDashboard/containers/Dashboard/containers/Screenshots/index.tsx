import React from 'react';
import { useRequest } from '@adnz/use-request';
import { useSelector } from 'react-redux';
import { getScreenshots } from '@adnz/api-ws-screenshots';
import ScreenshotBox from 'src/components/ScreenshotBox';
import * as companySelectSelectors from 'src/scenes/ServiceDashboard/containers/CompanySelect/selectors';

const Screenshots: React.FC = () => {
  const companyUuid = useSelector(companySelectSelectors.getActiveId);
  const [{ items: screenshots }] = useRequest({
    apiMethod: getScreenshots,
    defaultData: { items: [] },
    parameters: [{
      statuses: 'APPROVED',
      sortDirection: 'desc',
      size: 16,
      companyUuid,
    }],
  });
  return (
    <ScreenshotBox screenshots={screenshots} />
  );
};

export default Screenshots;
