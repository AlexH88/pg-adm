import {IReduxState} from '../../namespace';

const initialState: IReduxState = {
  pdfData: null,
  showPdfModal: false,
  showReportModal: false,
  showRegularModal: false,
  showRemoveModal: false,
  showReportSpinner: false,
  userDynamicReportData: [],
  userGroupsDynamicReportData: [],
  printerDynamicReportData: [],
  printerGroupsDynamicReportData: [],
};

export { initialState }
