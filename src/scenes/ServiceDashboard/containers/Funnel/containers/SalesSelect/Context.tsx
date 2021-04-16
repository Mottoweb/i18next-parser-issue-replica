import React from 'react';
import { Option } from 'src/types';

type Context = [
  Option<string> | null,
  React.Dispatch<React.SetStateAction<Option<string> | null>>,
];

const context = React.createContext<Context | null>(null);

export const useSalesSelectContext = (): Context => {
  const c = React.useContext(context);

  if (!c) {
    throw Error('Please use context inside SalesSelectContextProvider');
  }

  return c;
};

export const SalesSelectContextProvider: React.FC = ({
  children,
}) => {
  const [v, setV] = React.useState<Option<string> | null>(null);

  const value = React.useMemo<Context>(
    () => [v, setV],
    [v, setV],
  );

  return (
    <context.Provider value={value}>
      {children}
    </context.Provider>
  );
};
