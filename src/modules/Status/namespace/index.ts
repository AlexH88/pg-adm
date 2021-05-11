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
  currentCharts: any[];
  chartsData: any;
  replaced: any;
  showModal: boolean;
  modalMode: string;
  settings: any;
}

interface IActionsConfig {
  ignore: string;
  block: string;
  permit: string;
  forceDuplex: string;
  forceGrayscale: string;
  addWatermark: string;
  addSign: string;
  [ key: string ]: string;
}

type TypesFieldPolicy = 'usergroups' | 'printergroups' | 'hours' | 'days' | 'action' | 'alert' | 'counter';

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
}

export * from './actionTypes';
export * from './apiCommunication';
