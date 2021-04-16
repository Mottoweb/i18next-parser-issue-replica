import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { useTranslation } from 'react-i18next';

import { Loader } from '@adnz/ui';
import { useRequest } from '@adnz/use-request';
import { CreativesPage, getCreativesByCampaignId } from '@adnz/api-ws-adflow';

import PrintPositionScreenshot from './PrintPositionScreenshot';

import { Wrapper, List, Message } from './styles';

interface IPrintPositionScreenshots {
  campaignId: string
  motiveNumber: number
}

const PrintPositionScreenshots: React.FC<IPrintPositionScreenshots> = ({
  campaignId,
  motiveNumber,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const [data, { pending }] = useRequest({
    apiMethod: getCreativesByCampaignId,
    parameters: [{ campaignId }],
    runOnMount: true,
    defaultData: { items: [], total: 0 } as CreativesPage,
  });

  if (pending) {
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    );
  }

  if (data.total === 0) {
    return (
      <Wrapper>
        <Message>
          {t('serviceDashboard:THERE_ARE_NO_ENTRIES')}
        </Message>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <CSSTransition
        in={!pending}
        transitionAppear
        timeout={500}
        unmountOnExit
      >
        <List isLoaded={!pending}>
          {data.items.filter((creatives) => creatives.motiveNumber === motiveNumber).map((creative) => (
            <PrintPositionScreenshot key={creative.id} creative={creative} />
          ))}
        </List>
      </CSSTransition>
    </Wrapper>
  );
};

export default React.memo(PrintPositionScreenshots);
