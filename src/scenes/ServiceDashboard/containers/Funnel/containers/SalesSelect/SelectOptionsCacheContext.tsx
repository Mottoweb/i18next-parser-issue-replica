import React from 'react';
import { useRequest } from '@adnz/use-request';
import { Option } from 'src/types';
import { AxiosResponse } from 'axios';

type Cache = { values: Option<string>[], time: number };

const timeDiff = 5 * 60 * 1000;

export type Context = {
  loadOptions: (prefix: string) => Promise<Option<string>[]>
};

const context = React.createContext<Context | null>(null);

export const useSelectOptionsCacheContext = (): Context => {
  const c = React.useContext(context);

  if (!c) {
    throw Error('Please use context inside SelectOptionsCacheContextProvider');
  }

  return c;
};

const isCacheNotValid = (
  cache: Cache,
  prefix?: string,
) => !!prefix || cache.values.length === 0 || new Date().getTime() - cache.time > timeDiff;

type ResponseType = {
  id: string
  name?: string
};

type Props = {
  apiMethod: (args: { prefix?: string }) => Promise<AxiosResponse<ResponseType[]>>
};

export const SelectOptionsCacheContextProvider: React.FC<Props> = ({
  children,
  apiMethod,
}) => {
  const cache = React.useRef<Cache>({
    time: 0,
    values: [],
  });

  const [,, load] = useRequest({
    apiMethod,
    runOnMount: false,
  });

  const loadOptions = React.useCallback<Context['loadOptions']>(
    async (prefix) => {
      if (isCacheNotValid(cache.current, prefix)) {
        const response = await load({ prefix });
        const result = response.map((item) => ({
          label: item.name ?? '',
          value: item.id,
        }));

        if (cache.current.values.length === 0) {
          cache.current = {
            time: new Date().getTime(),
            values: result,
          };
        }

        return result;
      }

      return Promise.resolve(cache.current.values);
    },
    [load],
  );

  const value = React.useMemo<Context>(
    () => ({
      loadOptions,
    }),
    [loadOptions],
  );

  return (
    <context.Provider value={value}>
      {children}
    </context.Provider>
  );
};
