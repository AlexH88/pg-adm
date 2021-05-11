import * as NS from '../../namespace';

function sendCurrentCharts(data: string[]): NS.ISetCurrentCharts {
  return { type : 'STATUS_MODULE:SET_CURRENT_CHARTS', payload: data };
}

function toggleChart(value: string, isCheck: boolean) {
  return { type: 'STATUS_MODULE:TOGGLE_CHART', payload: { value, isCheck } };
}

function getChartsData(printedPagesInterval: string, dynamicGrowInterval: string ) {
  return { type: 'STATUS_MODULE:GET_CHARTS_DATA', payload: { printedPagesInterval, dynamicGrowInterval } };
}

function getTopUsersFromGroup(groupId: number) {
  return { type: 'STATUS_MODULE:GET_TOP_USERS_FROM_GROUP', payload: groupId };
}

function setReplacedChart(chartName: string, replaced: string) {
  return { type: 'STATUS_MODULE:SET_REPLACED_CHART', payload: { chartName, replaced } };
}

function getPrintedPages(interval: string) {
  return { type: 'STATUS_MODULE:GET_PRINTED_PAGES', payload: { interval } };
}

function getDynamicGrow(interval: string) {
  return { type: 'STATUS_MODULE:GET_DYNAMIC_GROW', payload: { interval } };
}

function switchModalStatus({ status, mode }: NS.IChangeModalStatusPayload): NS.ISwitchModalStatusAction {
  return { type: 'STATUS_MODULE:SWITCH_MODAL_STATUS', payload: { status, mode } };
}

function setSettingsChart(settings): NS.ISetSettingsChart {
  return { type: 'STATUS_MODULE:SET_SETTINGS_CHART', payload: settings };
}

function clearSettings(): NS.IClearSettings {
  return { type: 'STATUS_MODULE:CLEAR_SETTINGS_CHART'};
}

export {
  sendCurrentCharts,
  toggleChart,
  getChartsData,
  getTopUsersFromGroup,
  setReplacedChart,
  getPrintedPages,
  getDynamicGrow,
  switchModalStatus,
  setSettingsChart,
  clearSettings
};
