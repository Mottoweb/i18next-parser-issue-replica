import React, {
  useReducer, createContext, FunctionComponent, Dispatch, useContext,
} from 'react';
import { ActivityDto } from '@adnz/api-ws-activity';
import { CampaignDto } from '@adnz/api-ws-salesforce';

export enum ActionType {
  SaveActivities = 'saveActivities',
  DeleteActivity = 'deleteActivity',
  SetActivityEditable = 'setActivityEditable',
  AddActivity = 'addActivity',
  UpdateActivity = 'updateActivity',
  SaveCampaign = 'saveCampaign',
  AddAttachment = 'addAttachment',
  RemoveAttachment = 'removeAttachment',
}

export interface IAction {
  type: ActionType;
  payload: any
}

interface CampaignTool {
  campaign: CampaignDto | undefined,
  activities: ActivityDto[],
  editActivityId: string | undefined,
}

const reducer = (state: CampaignTool, action:IAction) => {
  switch (action.type) {
    case ActionType.SaveCampaign:
      return { ...state, campaign: action.payload };
    case ActionType.SaveActivities:
      return { ...state, activities: action.payload };
    case ActionType.AddActivity:
      return { ...state, activities: [action.payload, ...state.activities] };
    case ActionType.SetActivityEditable:
      return { ...state, editActivityId: action.payload.id };
    case ActionType.UpdateActivity:
      return { ...state, activities: state.activities.map((a) => (a.id === action.payload.id ? action.payload : a)) };
    case ActionType.AddAttachment:
      return {
        ...state,
        activities: state.activities.map((a) => {
          if (a.id === action.payload.activityId) {
            return ({ ...a, attachments: [...(a.attachments || []), ...(action.payload.attachment || [])] });
          }
          return a;
        }),
      };
    case ActionType.RemoveAttachment:
      return {
        ...state,
        activities: state.activities.map((a) => {
          if (a.id === action.payload.activityId) {
            return ({
              ...a,
              attachments: [...(a.attachments || [])
                .filter((atta) => !(action.payload.deletedFilesArray || []).some((f: string) => f === atta.id))],
            });
          }
          return a;
        }),
      };
    case ActionType.DeleteActivity:
      return {
        ...state,
        activities: state.activities.filter((activity: ActivityDto) => activity.id !== action.payload.id),
      };
    default:
      return state;
  }
};

const initialState: CampaignTool = {
  campaign: undefined,
  activities: [],
  editActivityId: undefined,
};

interface CampaignToolContextProps {
  state: CampaignTool,
  dispatch: Dispatch<IAction>,
}

const CampaignToolContext = createContext({} as CampaignToolContextProps);

const CampaignToolProvider:FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState as never);
  return (
    <CampaignToolContext.Provider value={{ state, dispatch }}>
      {children}
    </CampaignToolContext.Provider>
  );
};

const CampaignReloadContext = createContext<() => void>(() => {});
const useReloadCurrentCampaign = (): () => void => useContext(CampaignReloadContext);

export {
  CampaignToolContext, CampaignToolProvider, CampaignReloadContext, useReloadCurrentCampaign,
};
