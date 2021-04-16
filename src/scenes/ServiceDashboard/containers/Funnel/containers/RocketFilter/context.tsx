import React, {
  useState, createContext, FunctionComponent,
} from 'react';

interface IContextProps {
  onlyImportant: boolean,
  changeOnlyImportantFilter: (value: boolean) => void,
}

const TaskFilterContext = createContext({} as IContextProps);

const TasksFilterProvider:FunctionComponent = ({ children }) => {
  const [onlyImportant, changeOnlyImportantFilter] = useState<boolean>(false);

  const value = React.useMemo<IContextProps>(() => ({
    onlyImportant,
    changeOnlyImportantFilter,
  }), [onlyImportant, changeOnlyImportantFilter]);

  return (
    <TaskFilterContext.Provider value={value}>
      {children}
    </TaskFilterContext.Provider>
  );
};

export { TaskFilterContext, TasksFilterProvider };
