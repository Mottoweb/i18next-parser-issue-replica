import React from 'react';
import Upload from 'src/components/SimpleUpload';
import axios from 'axios';
import { getAuthHeaders } from 'src/api';

// todo Add document category
const UploadDocumentButton = ({
  campaign,
  handleUpload,
}) => {
  if (!campaign.hasPermission) return null;
  return (
    <Upload
      filesNumber={10}
      target={`${axios.defaults.baseURL}/api/ws-salesforce/documents/CAMPAIGN/${campaign.campaignId}/ui`}
      headers={getAuthHeaders()}
      handleComplete={handleUpload}
    />
  );
};

UploadDocumentButton.defaultProps = {
  campaign: undefined,
};

export default UploadDocumentButton;
