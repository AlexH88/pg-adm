import {IInjectedResource} from 'shared/helpers';


interface ISwitchReportModal extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SWITCH_REPORT_MODAL';
}

interface ISwitchRegularModal extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SWITCH_REGULAR_MODAL';
}

interface ISwitchPdfModal extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SWITCH_PDF_MODAL';
}

interface ISetPdfData extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SET_PDF_DATA';
}

interface IStartSaveRegularForm extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:START_SAVE_REGULAR_FORM';
}

interface IStartSaveReportForm extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:START_SAVE_REPORT_FORM';
}

interface ISendRegularForm extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SEND_REGULAR_FORM';
}

interface ISendRegularFormSuccess extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SEND_REGULAR_FORM_SUCCESS';
}

interface ISendRegularFormFailed extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SEND_REGULAR_FORM_FAILED';
}

interface ISendReportForm extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SEND_REPORT_FORM';
}

interface ISendTimeReportForm extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SEND_TIME_REPORT_FORM';
}

interface ISendReportFormSuccess extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SEND_REPORT_FORM_SUCCESS';
}

interface ISendReportFormFailed extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SEND_REPORT_FORM_FAILED';
}

interface ISwitchRemoveModal extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SWITCH_REMOVE_MODAL';
}

interface IAcceptDelete extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:ACCEPT_DELETE';
}

interface IDeleteReport extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:DELETE_REPORT';
}

interface IEditReport extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SET_EDIT_REPORT';
}

interface IGetUserTimeReports extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:GET_USER_TIME_REPORTS';
}

interface ISetUserDynamicReportData extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SET_USER_DYNAMIC_REPORT_DATA';
}

interface IGetUserGroupsTimeReports extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:GET_USERGROUPS_TIME_REPORTS';
}

interface ISetUserGroupsDynamicReportData extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SET_USERGROUPS_DYNAMIC_REPORT_DATA';
}

interface IGetPrinterTimeReports extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:GET_PRINTER_TIME_REPORTS';
}

interface ISetPrinterDynamicReportData extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SET_PRINTER_DYNAMIC_REPORT_DATA';
}

interface IGetPrinterGroupsTimeReports extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:GET_PRINTERGROUPS_TIME_REPORTS';
}

interface ISetPrinterGroupsDynamicReportData extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SET_PRINTERGROUPS_DYNAMIC_REPORT_DATA';
}

interface ISwitchReportSpinner extends IInjectedResource {
  type: 'USER_REPORTS_MODULE:SWITCH_REPORT_SPINNER';
}

type UserReportsModuleActions = (
  ISwitchReportModal
  | ISwitchRegularModal
  | IStartSaveRegularForm
  | IStartSaveReportForm
  | ISendRegularForm
  | ISendRegularFormSuccess
  | ISendRegularFormFailed
  | ISendReportForm
  | ISendTimeReportForm
  | ISendReportFormSuccess
  | ISendReportFormFailed
  | ISwitchRemoveModal
  | IAcceptDelete
  | ISwitchPdfModal
  | ISetPdfData
  | IDeleteReport
  | IEditReport
  | IGetUserTimeReports
  | ISetUserDynamicReportData
  | IGetUserGroupsTimeReports
  | ISetUserGroupsDynamicReportData
  | IGetPrinterTimeReports
  | ISetPrinterDynamicReportData
  | IGetPrinterGroupsTimeReports
  | ISetPrinterGroupsDynamicReportData
  | ISwitchReportSpinner
);

export {
  UserReportsModuleActions,
  ISwitchReportModal,
  ISwitchRegularModal,
  IStartSaveRegularForm,
  IStartSaveReportForm,
  ISendRegularForm,
  ISendRegularFormSuccess,
  ISendRegularFormFailed,
  ISendReportForm,
  ISendTimeReportForm,
  ISendReportFormSuccess,
  ISendReportFormFailed,
  ISwitchRemoveModal,
  IAcceptDelete,
  ISwitchPdfModal,
  ISetPdfData,
  IDeleteReport,
  IEditReport,
  IGetUserTimeReports,
  ISetUserDynamicReportData,
  IGetUserGroupsTimeReports,
  ISetUserGroupsDynamicReportData,
  IGetPrinterTimeReports,
  ISetPrinterDynamicReportData,
  IGetPrinterGroupsTimeReports,
  ISetPrinterGroupsDynamicReportData,
  ISwitchReportSpinner
}
