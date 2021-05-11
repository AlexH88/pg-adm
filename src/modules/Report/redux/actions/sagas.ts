import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {SagaIterator} from 'redux-saga';
import {getFormValues, initialize} from 'redux-form';
import {IExtraArguments, IOperator, IReduxState} from 'shared/types/app';
import {getErrorMsg, getResourceById} from 'shared/helpers';
import * as NS from '../../namespace';
import * as actions from './communication';
import injectResource from 'shared/helpers/injectResource';
import {loadResource, loadResourceFailed} from 'features/showResource/redux/actions/communication';
import {initDelay} from 'shared/api/converters/globalutils';
import * as showResourceFeature from 'features/showResource';

function getSaga({ api }: IExtraArguments) {

  function* executeDownloadReport({ meta }: NS.IDownloadReport){
    if (!meta) {
      throw Error('No meta');
    }
    try {
      const state = yield select();

      const formValues: any = yield select(getFormValues("editReport"));
      const startIso = new Date(state.report.settings.startDate).toISOString();
      const endIso = new Date(state.report.settings.endDate).toISOString();

      const newValues = {
        startDate: startIso,
        endDate: endIso,
        type: state.report.settings.typeReport
      }

      let sd = startIso.slice(0,10)
      let ed = endIso.slice(0,10)
      let type = '';

      if(state.report.settings.typeReport == 'PRINTER'){
        type = "принтерам"
      }
      if(state.report.settings.typeReport == 'USER'){
        type = "пользователям"
      }
      if(state.report.settings.typeReport == 'USER_GROUP'){
        type = "группам пользователей"
      }

      if(state.report.settings.typeReport == 'PRINTER_GROUP'){
        type = "группам принтеров"
      }

      const response = yield call(api.dowloadReport, newValues);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      saveAs(url, `Printer_Guard_Отчёт_по_${type}_с_${sd}_по_${ed}.xls`);

      yield put(actions.switchModalStatus({ status: false, mode: '' }));
    } catch (error) {
      const message = getErrorMsg(error);
      console.log('Errorr', message)
    }
  }

  function* executeSetSettingsReport(action: any) {

    const startDate: any = new Date(action.payload.startDate).toISOString();
    const endDate: any = new Date(action.payload.endDate).toISOString();

    const reportDate = {
      startDate,
      endDate,
    }

    localStorage.setItem("reportDate", JSON.stringify(reportDate));

    let resource = ''
    if(action.payload.typeReport == 'USER') {
      resource = 'reports'
    }
    if(action.payload.typeReport == 'PRINTER_GROUP') {
      resource = 'report_by_group_printers'
    }
    if(action.payload.typeReport == 'USER_GROUP') {
      resource = 'report_by_group_users'
    }
    if(action.payload.typeReport == 'PRINTER') {
      resource = 'report_by_printers'
    }

    yield put(injectResource(resource, showResourceFeature.actions.loadResource)(false, false));

  }


  function* saga(): SagaIterator {
    const downloadReport: NS.IDownloadReport ['type'] = 'REPORT_MODULE:DOWNLOAD_REPORT';
    const setSettingsReport: NS.ISetSettingsReport ['type'] = 'REPORT_MODULE:SET_SETTINGS_REPORT';

    yield all([
      takeLatest(downloadReport, executeDownloadReport),
      takeLatest(setSettingsReport, executeSetSettingsReport),
    ]);
  }

  return saga;
}

export { getSaga };
