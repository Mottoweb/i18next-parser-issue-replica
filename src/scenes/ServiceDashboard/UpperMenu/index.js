import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Row,
  Col,
} from 'styled-bootstrap-grid';
import AccountFilterSelect from 'src/modules/CampaignFilters/AgencySelect';

const UpperMenu = ({
  searchFilter,
  accountSelect,
  onlyOwnedAgencySelect,
  customSearchFilter,
}) => (
  <div className="bc-mainnav-new border-bottom" css="padding: 11px 0;">
    <Container>
      <Row className="bc-mainnav-nav-new-row">
        <Col lg={5} />
        <Col lg={7} className="search-filter-box">
          <div id="search-filter-dropdown" className="search-filter-box__dropdowns">
            {accountSelect && <AccountFilterSelect id="agency-select" />}
            {
              onlyOwnedAgencySelect
              && <AccountFilterSelect onlyOwnedAccounts={onlyOwnedAgencySelect} id="agency-select" />
            }
            {customSearchFilter && customSearchFilter()}
          </div>
          {searchFilter && searchFilter()}
        </Col>
      </Row>
    </Container>
  </div>
);

UpperMenu.defaultProps = {
  accountSelect: false,
  searchFilter: undefined,
  onlyOwnedAgencySelect: false,
  customSearchFilter: null,
};

UpperMenu.propTypes = {
  accountSelect: PropTypes.bool,
  searchFilter: PropTypes.func,
  onlyOwnedAgencySelect: PropTypes.bool,
  customSearchFilter: PropTypes.func,
};

export default React.memo(UpperMenu);
