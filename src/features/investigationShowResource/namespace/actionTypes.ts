import {IInjectedResource} from 'shared/helpers/injectResource';

type IMode = 'edit' | 'create' | 'partial-edit' | '';

interface IEditPayload {
  id: number;
  mode: IMode;
}

interface IChangeModalStatusPayload {
  status: boolean;
  mode: IMode;
}

interface IGetHashData extends IInjectedResource {
  type: 'SHOW_INVESTIGATION_RESOURCE:GET_HASH_DATA';
}

interface ISwitchModalStatusAction extends IInjectedResource {
  type: 'SHOW_INVESTIGATION_RESOURCE:SWITCH_MODAL_STATUS';
}

type InvestigationModuleActionsWithInjectedResource =
  (IGetHashData
  | IGetHashData
  | ISwitchModalStatusAction) & IInjectedResource;

export {
  IGetHashData,
  ISwitchModalStatusAction,
  IChangeModalStatusPayload
}
