import styled from 'styled-components';
import { Label } from '@adnz/ui';
import Media from 'src/theme/Media';

export const PDFPreviewBlock = styled.div`
  .angebot {
    margin: 0;
    padding: 40px;
    box-shadow: 0 2px 2px 0 rgba(61,88,128,0.05);
    &__body {
      margin: 0;
    }
    &__table {
      padding: 0;
      tfoot._vat tr td {
        font-size: 14px;
      }
    }
  }
`;

export const AgreementField = styled(Label)`
  @media ${Media.lgMin} {
    margin: 26px 0 20px;
    height: 38px;
    display: flex;
    align-items: center;
  }
`;

export const MethodBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0 22px;
  > * {
    margin: 10px 0 0 0!important;
  }
`;

export const RightBlock = styled.div`
  width: 100%;
`;

export const LeftBlock = styled.div`
  min-width: 307px;
  max-width: 307px;
  @media ${Media.lgMin} {
    margin-right: 15px;
  }
  @media ${Media.mdMax} {
    margin-bottom: 20px;
  }
  
  .StripeElement {
    height: 38px;
    border: solid 1px #dadada!important;
    border-radius: 2px;
    padding: 0 0 0 5px;
  }
  .steps__confirm {
    justify-content: flex-start;
  }
`;

export const WrapperBlock = styled.div`
  display: flex;
  margin-top: 5px;
  @media ${Media.mdMax} {
    flex-direction: column;
  }
`;
