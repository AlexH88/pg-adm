import {fromJS, Map} from 'immutable';
import * as NS from '../../namespace';
import {IReduxState} from '../../namespace';
import {initialState} from '../data/initial';

function mainReducer(state: IReduxState = initialState, action: NS.UserReportsModuleActions): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);
  switch (action.type) {

  case 'USER_REPORTS_MODULE:SWITCH_REPORT_MODAL': {
    const showReportModal = imState.get('showReportModal');
    return imState.set('showReportModal', !showReportModal).toJS();
  }

  case 'USER_REPORTS_MODULE:SWITCH_REGULAR_MODAL': {
    const showRegularModal = imState.get('showRegularModal');
    return imState.set('showRegularModal', !showRegularModal).toJS();
  }

  case 'USER_REPORTS_MODULE:SWITCH_PDF_MODAL': {
    const showPdfModal = imState.get('showPdfModal');
    return imState.set('showPdfModal', !showPdfModal).toJS();
  }

  case 'USER_REPORTS_MODULE:SET_PDF_DATA': {
    return imState.set('pdfData', action.payload).toJS();
  }

  case 'USER_REPORTS_MODULE:SWITCH_REMOVE_MODAL': {
    const showRemoveModal = imState.get('showRemoveModal');
    return imState.set('showRemoveModal', !showRemoveModal).toJS();
  }

  case 'USER_REPORTS_MODULE:SET_USER_DYNAMIC_REPORT_DATA': {
    return imState.set('userDynamicReportData', action.payload).toJS();
  }

  case 'USER_REPORTS_MODULE:SET_USERGROUPS_DYNAMIC_REPORT_DATA': {
    return imState.set('userGroupsDynamicReportData', action.payload).toJS();
  }

  case 'USER_REPORTS_MODULE:SET_PRINTER_DYNAMIC_REPORT_DATA': {
    return imState.set('printerDynamicReportData', action.payload).toJS();
  }

  case 'USER_REPORTS_MODULE:SET_PRINTERGROUPS_DYNAMIC_REPORT_DATA': {
    return imState.set('printerGroupsDynamicReportData', action.payload).toJS();
  }

  case 'USER_REPORTS_MODULE:SWITCH_REPORT_SPINNER': {
    const showReportSpinner = imState.get('showReportSpinner');
    return imState.set('showReportSpinner', !showReportSpinner).toJS();
  }

  default:
    return state;
  }
}

export default mainReducer;
