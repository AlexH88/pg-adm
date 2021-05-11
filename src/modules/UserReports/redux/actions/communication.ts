import * as NS from '../../namespace';

// import {IPeriod} from "../../namespace/apiCommunication";

function switchReportModal(): NS.ISwitchReportModal {
  return { type: 'USER_REPORTS_MODULE:SWITCH_REPORT_MODAL' };
}

function switchRegularModal(): NS.ISwitchRegularModal {
  return { type: 'USER_REPORTS_MODULE:SWITCH_REGULAR_MODAL' };
}

function switchPdfModal(): NS.ISwitchPdfModal {
  return { type: 'USER_REPORTS_MODULE:SWITCH_PDF_MODAL' };
}

function setPdfData(data : any): NS.ISetPdfData {
  return { type: 'USER_REPORTS_MODULE:SET_PDF_DATA', payload: data };
}

function startSaveRegularForm(): NS.IStartSaveRegularForm {
  return { type: 'USER_REPORTS_MODULE:START_SAVE_REGULAR_FORM' };
}

function startSaveReportForm(): NS.IStartSaveReportForm {
  return { type: 'USER_REPORTS_MODULE:START_SAVE_REPORT_FORM' };
}

function sendRegularForm(data : any): NS.ISendRegularForm {
  return { type: 'USER_REPORTS_MODULE:SEND_REGULAR_FORM', payload: data };
}

function sendRegularFormSuccess(data: NS.ISuccessResponse): NS.ISendRegularFormSuccess {
  return { type: 'USER_REPORTS_MODULE:SEND_REGULAR_FORM_SUCCESS', payload: data };
}

function sendRegularFormFailed(message: string): NS.ISendRegularFormFailed {
  return { type: 'USER_REPORTS_MODULE:SEND_REGULAR_FORM_FAILED', payload: message };
}

function sendReportForm(data : any): NS.ISendReportForm {
  return { type: 'USER_REPORTS_MODULE:SEND_REPORT_FORM', payload: data  };
}

function sendTimeReportForm(data : any): NS.ISendTimeReportForm {
  return { type: 'USER_REPORTS_MODULE:SEND_TIME_REPORT_FORM', payload: data  };
}

function sendReportFormSuccess(data: NS.ISuccessResponse): NS.ISendReportFormSuccess {
  return { type: 'USER_REPORTS_MODULE:SEND_REPORT_FORM_SUCCESS', payload: data };
}

function sendReportFormFailed(message: string): NS.ISendReportFormFailed {
  return { type: 'USER_REPORTS_MODULE:SEND_REPORT_FORM_FAILED', payload: message };
}

function switchRemoveModal(): NS.ISwitchRemoveModal {
  return { type: 'USER_REPORTS_MODULE:SWITCH_REMOVE_MODAL' };
}

function acceptDelete(): NS.IAcceptDelete {
  return { type: 'USER_REPORTS_MODULE:ACCEPT_DELETE' };
}

function deleteReport(id: any): NS.IDeleteReport {
  return { type: 'USER_REPORTS_MODULE:DELETE_REPORT', payload: id };
}

function setEditReport(data: any): NS.IEditReport {
  return { type: 'USER_REPORTS_MODULE:SET_EDIT_REPORT', payload: data };
}

function getUserTimeReports(interval: any): NS.IGetUserTimeReports {
  return { type: 'USER_REPORTS_MODULE:GET_USER_TIME_REPORTS', payload: interval };
}

function setUserDynamicReportData(data: any): NS.ISetUserDynamicReportData {
  return { type: 'USER_REPORTS_MODULE:SET_USER_DYNAMIC_REPORT_DATA', payload: data };
}

function getUserGroupsTimeReports(interval: any): NS.IGetUserGroupsTimeReports {
  return { type: 'USER_REPORTS_MODULE:GET_USERGROUPS_TIME_REPORTS', payload: interval };
}

function getPrinterTimeReports(interval: any): NS.IGetPrinterTimeReports {
  return { type: 'USER_REPORTS_MODULE:GET_PRINTER_TIME_REPORTS', payload: interval };
}

function getPrinterGroupsTimeReports(interval: any): NS.IGetPrinterGroupsTimeReports {
  return { type: 'USER_REPORTS_MODULE:GET_PRINTERGROUPS_TIME_REPORTS', payload: interval };
}

function switchReportSpinner(): NS.ISwitchReportSpinner {
  return { type: 'USER_REPORTS_MODULE:SWITCH_REPORT_SPINNER' };
}

export {
  switchReportModal,
  switchRegularModal,
  startSaveRegularForm,
  startSaveReportForm,
  sendRegularForm,
  sendRegularFormSuccess,
  sendRegularFormFailed,
  sendReportForm,
  sendTimeReportForm,
  sendReportFormSuccess,
  sendReportFormFailed,
  switchRemoveModal,
  acceptDelete,
  switchPdfModal,
  setPdfData,
  deleteReport,
	setEditReport,
  getUserTimeReports,
  setUserDynamicReportData,
  getUserGroupsTimeReports,
  getPrinterTimeReports,
  getPrinterGroupsTimeReports,
  switchReportSpinner
};
