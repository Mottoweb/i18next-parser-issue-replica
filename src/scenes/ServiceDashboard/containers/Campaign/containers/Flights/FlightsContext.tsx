import React, { createContext, useContext, useMemo } from 'react';
import { LineItemStateDtoStateInline } from '@adnz/api-ws-salesforce';

interface FlightsContextType {
  isStatusVisible: boolean,
  isViewabilityShown: boolean,
  isEditable: boolean,
  positionStateByPositionId: Record<string, LineItemStateDtoStateInline>
}

const flightsContext = createContext<FlightsContextType>({
  isStatusVisible: false,
  isViewabilityShown: false,
  isEditable: false,
  positionStateByPositionId: {},
});

export const useFlightsContext = (): FlightsContextType => useContext(flightsContext);

export const FlightsContextProvider: React.FC<FlightsContextType > = (
  {
    children,
    isStatusVisible,
    isViewabilityShown,
    positionStateByPositionId,
    isEditable,
  },
) => {
  const contextValue: FlightsContextType = useMemo(() => ({
    isStatusVisible,
    isViewabilityShown,
    positionStateByPositionId,
    isEditable,
  }), [isStatusVisible, isViewabilityShown, positionStateByPositionId, isEditable]);

  return <flightsContext.Provider value={contextValue}>{children}</flightsContext.Provider>;
};
