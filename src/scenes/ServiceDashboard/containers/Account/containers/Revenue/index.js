import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import BarChart from 'src/components/BarChart';
import * as selectors from './selectors';

const Revenue = ({ itemId, ...props }) => {
  const dataset = useSelector((state) => selectors.getDataset(state, { itemId }));
  return (
    <BarChart
      size={{ width: 250 }}
      aspectRatio={1}
      onMouseOver={() => null}
      onMouseOut={() => null}
      dataset={dataset}
      {...props}
    />
  );
};

Revenue.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default Revenue;
