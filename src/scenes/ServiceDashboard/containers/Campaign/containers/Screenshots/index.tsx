import React from 'react';
import ScreenshotBox from 'src/components/ScreenshotBox';
import { getScreenshots } from '@adnz/api-ws-screenshots';
import { useRequest } from '@adnz/use-request';

const Screenshots: React.FC<{ campaignId: string }> = ({ campaignId }) => {
  const [{ items: screenshots }] = useRequest({
    apiMethod: getScreenshots,
    defaultData: { items: [] },
    parameters: [{ campaignId, statuses: 'APPROVED', size: 16 }],
  });

  return (
    <ScreenshotBox screenshots={screenshots} />
  );
};

export default Screenshots;
