import * as NS from '../../namespace';

function switchModalStatus({ status, mode }: NS.IChangeModalStatusPayload): NS.ISwitchModalStatusAction {
  return { type: 'REPORT_MODULE:SWITCH_MODAL_STATUS', payload: { status, mode } };
}

function downloadReport(): NS.IDownloadReport {
  return { type: 'REPORT_MODULE:DOWNLOAD_REPORT' };
}

function setSettingsReport(settings): NS.ISetSettingsReport {
  return { type: 'REPORT_MODULE:SET_SETTINGS_REPORT', payload: settings };
}

function clearSettings(): NS.IClearSettings {
  return { type: 'REPORT_MODULE:CLEAR_SETTINGS'};
}

export {
  switchModalStatus,
  downloadReport,
  setSettingsReport,
  clearSettings
};
