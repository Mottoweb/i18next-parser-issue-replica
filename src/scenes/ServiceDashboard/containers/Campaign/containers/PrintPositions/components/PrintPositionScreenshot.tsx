import React from 'react';
import { saveAs } from 'file-saver';

import { CreativeDto } from '@adnz/api-ws-adflow';
import { Button, Modal, Icons } from '@adnz/ui';

import { Item } from './styles';

interface IPrintPositionScreenshot {
  creative: CreativeDto
}

const PrintPositionScreenshot: React.FC<IPrintPositionScreenshot> = ({
  creative,
}) => {
  const [opened, setOpened] = React.useState(false);

  return (
    <Item>
      <Modal
        title={creative.fileName}
        isOpen={opened}
        actions={[
          <Button icon onClick={() => saveAs(creative.pdfLink, creative.fileName)}>
            <Icons.Download color="#fff" />
          </Button>,
        ]}
        children={(
          <Modal.Body css="text-align: center;">
            <img src={creative.previewLink} />
          </Modal.Body>
        )}
        onRequestClose={() => setOpened(false)}
      />
      <img src={creative.thumbnailLink} onClick={() => setOpened((s) => !s)} />
    </Item>
  );
};

export default React.memo(PrintPositionScreenshot);
