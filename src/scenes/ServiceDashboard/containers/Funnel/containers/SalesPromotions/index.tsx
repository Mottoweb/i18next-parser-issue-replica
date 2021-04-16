import React from 'react';
import Index from './IndexPage';
import reducer, { initialState } from './reducer';
import SalesPromotionsContext from './context';

const SalesPromotions: React.FC = () => {
  const value = React.useReducer(reducer, initialState);
  return (
    <SalesPromotionsContext.Provider value={value}>
      <Index />
    </SalesPromotionsContext.Provider>
  );
};

export default SalesPromotions;
