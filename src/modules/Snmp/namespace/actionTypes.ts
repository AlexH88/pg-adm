import {IAction} from 'shared/types/app';
// import { IInjectedResource } from 'shared/helpers/injectResource';
// import {
//   IFailedResponse,
//   IResponse,
//   IGetGroupsSuccessPayload,
//   IChoosenEditPolicy,
// } from './index';

interface ISetCurrentCharts extends IAction<string[]> {
  type: 'STATUS_MODULE:SET_CURRENT_CHARTS'
}

interface IToggleChart extends IAction<any> {
  type: 'STATUS_MODULE:TOGGLE_CHART'
}

interface IGetChartsData extends IAction<any> {
  type: 'STATUS_MODULE:GET_CHARTS_DATA'
}

interface ISetChartData extends IAction<any> {
  type: 'STATUS_MODULE:SET_CHART_DATA'
}

interface IGetTopUsersFromGroup extends IAction<any> {
  type: 'STATUS_MODULE:GET_TOP_USERS_FROM_GROUP'
}

interface ISetReplacedChart extends IAction<any> {
  type: 'STATUS_MODULE:SET_REPLACED_CHART'
}

interface IGetPrintedPages extends IAction<any> {
  type: 'STATUS_MODULE:GET_PRINTED_PAGES'
}

interface IGetDynamicGrow extends IAction<any> {
  type: 'STATUS_MODULE:GET_DYNAMIC_GROW'
}

type StatusModuleActions = (
  ISetCurrentCharts
  | IToggleChart
  | ISetChartData
  | IGetChartsData
  | IGetTopUsersFromGroup
  | ISetReplacedChart
  | IGetPrintedPages
  | IGetDynamicGrow
);

export {
  StatusModuleActions,
  ISetCurrentCharts,
  IToggleChart,
  ISetChartData,
  IGetChartsData,
  IGetTopUsersFromGroup,
  ISetReplacedChart,
  IGetPrintedPages,
  IGetDynamicGrow
}
