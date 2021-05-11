import {IRuleGroup} from 'shared/types/policy';

interface IAgregate {
  value: string;
  title: string;
}

interface IPolicy {
  description: string;
  owner: string;
  name: string;
  state: boolean;
  id: number;
}

interface IFailedResponse {
  error: string;
}

interface IGetGroupsSuccessPayload {
  userGroups: IRuleGroup;
  printerGroups: IRuleGroup;
}

interface ISetHoursDaysCodePayload {
  daysCode: string;
  hoursCode: string;
}

interface ISetDaysCodePayload {
  daysCode: string;
}

interface ISetHoursCodePayload {
  hoursCode: string;
}

interface IResponse {
  response: {};
}

interface IChoosenEditPolicy {
  id: number;
  name: string;
}

interface IReduxState {
  isPolicyEdit: boolean,
  showRemoveModal: boolean;
  showSaveModal: boolean;
  showMarkModal: boolean;
  showCreateEditModal: boolean;
  showWatermarksSettingsModal: boolean;
  showAddModal: boolean; // #AddRule
  showConfirmModal: boolean;
  userGroups: IRuleGroup[];
  printerGroups: IRuleGroup[];
  hostGroups: any[];
  choosenPolicyEdit: IChoosenEditPolicy | null;
  choosenMarkPolicyEdit: IChoosenEditPolicy | null;
  textLabelsData: any[];
  showDecryptModal: boolean;
  decryptMessage: string;
  modalMode: IMode;
  addWaterMark: {
    type: string,
    text: string,
    status: boolean,
  };
}

interface IActionsConfig {
  // ignore: string;
  block: string;
  permit: string;
  // forceDuplex: string;
  // forceGrayscale: string;
  // addWatermark: string;
  // addSign: string;
  [ key: string ]: string;
}

type IMode = 'edit' | 'create' | 'partial-edit' | '';

type TypesFieldPolicy = 'state' | 'userGroups' | 'printerGroups' | 'hours' | 'days' | 'action' | 'alert' | 'counter';

export {
  IAgregate,
  IPolicy,
  IReduxState,
  IFailedResponse,
  IResponse,
  IActionsConfig,
  TypesFieldPolicy,
  IGetGroupsSuccessPayload,
  ISetHoursDaysCodePayload,
  ISetDaysCodePayload,
  ISetHoursCodePayload,
  IChoosenEditPolicy,
  IMode
}

export * from './actionTypes';
export * from './apiCommunication';
