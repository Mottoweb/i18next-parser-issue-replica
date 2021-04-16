import React from 'react';
import PropTypes from 'prop-types';
import AddressLine from '../../../Campaign/components/DetailsInfoBlock/components/AddressLine';
import Container from '../../../Campaign/components/DetailsInfoBlock/components/Container';

const Body = ({ account, postal }) => (
  <Container>
    <AddressLine postal={postal} account={account} />
  </Container>
);

Body.propTypes = {
  postal: PropTypes.bool,
};

Body.defaultProps = {
  postal: false,
};

const Footer = () => (
  null
);

Footer.propTypes = {
};

Footer.defaultProps = {
  contact: undefined,
};

export default {
  Body,
  Footer,
};
