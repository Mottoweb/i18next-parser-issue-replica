import React from 'react';
import Screenshot from 'src/components/Screenshot';
import { useRequest } from '@adnz/use-request';
import { ScreenshotDto as ScreenshotType, getScreenshots } from '@adnz/api-ws-screenshots';
import styled from 'styled-components';
import Colors from 'src/theme/Colors';
import { useTranslation } from 'react-i18next';
import { ButtonGroup } from '@adnz/ui';

const NoData = styled.div`
  font-weight: 600;
  color: ${Colors.Tuna};
  text-align: center;
  min-height: 150px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Screenshots:React.FC<{ positionId: string }> = ({ positionId }) => {
  const [{ items: screenshots }] = useRequest({
    apiMethod: getScreenshots,
    defaultData: { items: [] as ScreenshotType[] },
    parameters: [{ positionId, statuses: 'APPROVED', size: 15 }],
  });

  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  return (
    <>
      {screenshots.length === 0 ? (
        <NoData>{t('serviceDashboard:THERE_ARE_NO_ENTRIES')}</NoData>
      ) : (
        <ButtonGroup>
          {
              screenshots.map(
                (screenshot) => (
                  <Screenshot
                    key={screenshot.name}
                    screenshot={screenshot}
                  />
                ),
              )
            }
        </ButtonGroup>
      )}
    </>
  );
};

export default Screenshots;
