import * as NS from '../../namespace';
import * as actions from './communication';

import {IExtraArguments, IReduxState} from 'shared/types/app';
import {all, call, put, select, take, takeLatest} from 'redux-saga/effects';
import {SagaIterator} from 'redux-saga';
import {getFormValues, initialize} from 'redux-form';
import injectResource from 'shared/helpers/injectResource';
import * as showResourceFeature from 'features/showResource';

import getErrorMsg from 'shared/helpers/getErrorMessage';
import {userReportsApi as thisApi} from "../../api/index";
// import getResourceById from "../../../../shared/helpers/getResourceById";
import {getAxis, getPeriod, getResourceTypeByMetaResource} from '../index';
// import {loadResource} from "../../../../features/showResource/redux/actions/communication";
// import getResourceById from "../../../../shared/helpers/getResourceById";


function getSaga({ api }: IExtraArguments) {

  function* executeStartSaveRegularForm({ meta }: NS.IStartSaveRegularForm) {
    if (!meta) {
      throw Error('No meta!');
    }
    const formName = 'add_regular';
    const filtersData = yield select((state: IReduxState) => state.filterResource[meta.resource]);
    yield put(actions.switchRegularModal());
    yield put(initialize(formName, filtersData.filterConfigs, true));
		console.log(filtersData.filterConfigs);
	}

  function* executeSendRegularForm({ meta }: any) {
    if(!1) console.log(meta);
    try {
      const formName = 'add_regular';
      const rowRegularFormData = yield select(getFormValues(formName));
      let extraEmails = [];
      if (rowRegularFormData.emails && rowRegularFormData.emails.length) {
        extraEmails = rowRegularFormData.emails.map((item: { email: string }) => item.email);
      }
      const emails = [ ...extraEmails, rowRegularFormData['first-email'] ].join(',');
      const regularFormData = { ...rowRegularFormData, emails };
      delete regularFormData['first-email'];
      const response = yield call(api.saveRegularReport, regularFormData);
      yield put(actions.sendRegularFormSuccess(response.data));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.sendRegularFormFailed(message));
    } finally {
      yield put(actions.switchRegularModal());
    }
  }

  function* executeStartSaveReportForm({ meta }: NS.IStartSaveRegularForm) {
    if (!meta) {
      throw Error('No meta!');
    }
    const formName = 'add_report';
    const filtersData = yield select((state: IReduxState) => state.filterResource[meta.resource]);
    yield put(actions.switchReportModal());
    yield put(initialize(formName, filtersData.filterConfigs, true));
  }

  function* executeSendReportForm({ meta }: any) {
    try {
      const formName = 'add_report';
      const rowReportFormData = yield select(getFormValues(formName));
      const isStatic: boolean = ['user_reports', 'user_groups_reports', 'printer_reports', 'printer_groups_reports']
                                                                                        .indexOf(meta.resource) !== -1;
      const reports = yield select((state: IReduxState) => {
        if (isStatic) {
          return state.showResource[meta.resource];
        } else {
          const resourceByResourceName: any = {
            user_timereports: 'userDynamicReportData',
            user_groups_timereports: 'userGroupsDynamicReportData',
            printer_timereports: 'printerDynamicReportData',
            printer_groups_timereports: 'printerGroupsDynamicReportData',
          };
          const resourceName = resourceByResourceName[meta.resource];
          return state.userReports && (state.userReports as any)[resourceName]
        }
      });
      console.log(reports);
      
      let reportsData = [];
      if (isStatic) {
        reportsData = reports.data[0] && reports.data[0]
                                            .slice(0, Math.min(reports.data[0].length, rowReportFormData.amount_users));
      } else {
        reportsData = reports && reports.slice(0, Math.min(reports.length, rowReportFormData.amount_users));
      }
      console.log(reportsData);

      const mappedRegularFormData = {
        data: reportsData,
        type: rowReportFormData.type ? rowReportFormData.type === 0 ? 'histogram' : 'pie' : null
      };
      const regularFormData = { ...mappedRegularFormData };
      yield put(actions.switchReportSpinner());
      const response = yield call(api.saveReport, regularFormData);
      yield put(actions.sendReportFormSuccess(response.data));
      yield put(actions.setPdfData(`${response.id}`));
      yield put(actions.switchPdfModal());
      yield put(actions.switchReportModal());
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.sendRegularFormFailed(message));
    }
    yield put(actions.switchReportSpinner());
  }

  function* executeSendTimeReportForm({ meta }: any) {
    try {
      const formName = 'add_report';
      const rowReportFormData = yield select(getFormValues(formName));
      // const reports = yield select((state: IReduxState) => {
      //   const resourceByResourceName: any = {
      //     user_timereports: 'userDynamicReportData',
      //     user_groups_timereports: 'userGroupsDynamicReportData',
      //     printer_timereports: 'printerDynamicReportData',
      //     printer_groups_timereports: 'printerGroupsDynamicReportData',
      //   };
      //   const resourceName = resourceByResourceName[meta.resource];
      //   return state.userReports && (state.userReports as any)[resourceName]
      // });
      // let reportsData = [];
      // reportsData = reports && reports.slice(0, Math.min(reports.length, rowReportFormData.amount_users));

      // type: 'users'|'printers'|'user_groups'|'printer_groups',
      // interval: 'day'|'week'|'month',
      // yAxis: 'pages'|'jobs'|'price',
      // const mappedRegularFormData = {
      //   data: reportsData,
      //   type: rowReportFormData.type ? rowReportFormData.type === 0 ? 'histogram' : 'pie' : null
      // };
      // const regularFormData = { ...mappedRegularFormData };
      const state = yield select();
      console.log(state);
      const regularFormData = {
        type: getResourceTypeByMetaResource(meta.resource),
        interval: getPeriod(state, meta.resource),
        yAxis: getAxis(state, meta.resource)
      };
      yield put(actions.switchReportSpinner());
      const response = yield call(api.saveTimeReport, regularFormData);
      yield put(actions.sendReportFormSuccess(response.data));
      yield put(actions.setPdfData(`${response.id}`));
      yield put(actions.switchPdfModal());
      yield put(actions.switchReportModal());
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.sendRegularFormFailed(message));
    }
    yield put(actions.switchReportSpinner());
  }

	// TODO обработка ошибки
	function* executeDeleteReport({ meta, payload }: NS.IDeleteReport) {
		if (!meta) {
			throw Error('No meta');
		}
		try {

			yield take(actions.acceptDelete().type);
			const response = yield call(api.deleteResource, meta.resource, payload);
			yield put(injectResource(meta.resource, showResourceFeature.actions.loadResource)(false, false));

			console.log(response);
			yield put(actions.switchRemoveModal());
		} catch (error) {

		}
	}

	function* executeGetUserTimeReports({ payload }: any) {
  	try {
      const state = yield select();

      // console.log('STATE ON executeGetUserTimeReports:');
      // console.log(state);

      const filterConfigs = state.filterResource["user_timereports"].filterConfigs;
      console.log('before api getUserTimereports');
      const response = yield call(thisApi.getUserTimereports, payload, filterConfigs);
      console.log('after api getUserTimereports');

      // console.log('before put SET_USER_DYNAMIV_REPORT_DATA');
      yield put({type: 'USER_REPORTS_MODULE:SET_USER_DYNAMIC_REPORT_DATA', payload: response.data});
      // console.log('after put SET_USER_DYNAMIV_REPORT_DATA');
		} catch(error) {
  		console.error('Ошибка при получении очетов'); // TODO переделать
		}
  }

  function* executeGetUserGroupsTimeReports({ payload }: any) {
  	try {
      const state = yield select();

      // console.log('STATE ON executeGetUserTimeReports:');
      // console.log(state);

      const filterConfigs = state.filterResource["user_groups_timereports"].filterConfigs;
      console.log('before api getUserGroupsTimereports');
      const response = yield call(thisApi.getUserGroupsTimereports, payload, filterConfigs);
      console.log('after api getUserGroupsTimereports');

      // console.log('before put SET_USER_DYNAMIV_REPORT_DATA');
      yield put({type: 'USER_REPORTS_MODULE:SET_USERGROUPS_DYNAMIC_REPORT_DATA', payload: response.data});
      // console.log('after put SET_USER_DYNAMIV_REPORT_DATA');
		} catch(error) {
  		console.error('Ошибка при получении очетов'); // TODO переделать
		}
  }

  function* executeGetPrinterTimeReports({ payload }: any) {
  	try {
      const state = yield select();

      // console.log('STATE ON executeGetUserTimeReports:');
      // console.log(state);

      const filterConfigs = state.filterResource["printer_timereports"].filterConfigs;
      console.log('before api getPrinterTimereports');
      const response = yield call(thisApi.getPrinterTimereports, payload, filterConfigs);
      console.log('after api getPrinterTimereports');

      // console.log('before put SET_USER_DYNAMIV_REPORT_DATA');
      yield put({type: 'USER_REPORTS_MODULE:SET_PRINTER_DYNAMIC_REPORT_DATA', payload: response.data});
      // console.log('after put SET_USER_DYNAMIV_REPORT_DATA');
		} catch(error) {
  		console.error('Ошибка при получении очетов'); // TODO переделать
		}
  }

  function* executeGetPrinterGroupsTimeReports({ payload }: any) {
  	try {
      const state = yield select();

      // console.log('STATE ON executeGetUserTimeReports:');
      // console.log(state);

      const filterConfigs = state.filterResource["printer_groups_timereports"].filterConfigs;
      console.log('before api getPrinterGroupsTimereports');
      const response = yield call(thisApi.getPrinterGroupsTimereports, payload, filterConfigs);
      console.log('after api getPrinterGroupsTimereports');

      // console.log('before put SET_USER_DYNAMIV_REPORT_DATA');
      yield put({type: 'USER_REPORTS_MODULE:SET_PRINTERGROUPS_DYNAMIC_REPORT_DATA', payload: response.data});
      // console.log('after put SET_USER_DYNAMIV_REPORT_DATA');
		} catch(error) {
  		console.error('Ошибка при получении очетов'); // TODO переделать
		}
	}

	function* executeEditReport(action: any) {
  	console.log('executeEditReport !!! ');
		// const { resource } = action.meta ? action.meta : { resource: '' };
		const formName = 'add_regular';
		try {
			// const editedResource: any = yield select((state: IReduxState) =>
			// 	getResourceById(resource, state, action.payload.id));
			const editedResource = action.payload;
			yield put(actions.switchRegularModal());
			console.log(editedResource);

			yield put(initialize(formName, {
				'period' : editedResource.period,
				'order_by': editedResource.order_by,
				'first-email': 'asdasd',
			}, true));

		} catch (error) {
			console.log('erorr!');
		}
	}

  function* saga(): SagaIterator {

    const startSaveRegularForm:         NS.IStartSaveRegularForm         ['type'] = 'USER_REPORTS_MODULE:START_SAVE_REGULAR_FORM';
    const saveRegularForm:              NS.ISendRegularForm              ['type'] = 'USER_REPORTS_MODULE:SEND_REGULAR_FORM';
    const startSaveReportForm:          NS.IStartSaveReportForm          ['type'] = 'USER_REPORTS_MODULE:START_SAVE_REPORT_FORM';
    const saveReportForm:               NS.ISendReportForm               ['type'] = 'USER_REPORTS_MODULE:SEND_REPORT_FORM';
    const saveTimeReportForm:           NS.ISendTimeReportForm           ['type'] = 'USER_REPORTS_MODULE:SEND_TIME_REPORT_FORM';
		const deleteResource:    	         	NS.IDeleteReport    		         ['type'] = 'USER_REPORTS_MODULE:DELETE_REPORT';
		const editResource:    	          	NS.IEditReport     		    	     ['type'] = 'USER_REPORTS_MODULE:SET_EDIT_REPORT';
	  const getUserTimeReports:           NS.IGetUserTimeReports           ['type'] = 'USER_REPORTS_MODULE:GET_USER_TIME_REPORTS';
	  const getUserGroupsTimeReports:     NS.IGetUserGroupsTimeReports     ['type'] = 'USER_REPORTS_MODULE:GET_USERGROUPS_TIME_REPORTS';
	  const getPrinterTimeReports:        NS.IGetPrinterTimeReports        ['type'] = 'USER_REPORTS_MODULE:GET_PRINTER_TIME_REPORTS';
	  const getPrinterGroupsTimeReports:  NS.IGetPrinterGroupsTimeReports  ['type'] = 'USER_REPORTS_MODULE:GET_PRINTERGROUPS_TIME_REPORTS';

    yield all([
      takeLatest(startSaveRegularForm, executeStartSaveRegularForm),
      takeLatest(saveRegularForm, executeSendRegularForm),
      takeLatest(startSaveReportForm, executeStartSaveReportForm),
      takeLatest(saveReportForm, executeSendReportForm),
      takeLatest(saveTimeReportForm, executeSendTimeReportForm),
      takeLatest(deleteResource, executeDeleteReport),
      takeLatest(editResource, executeEditReport),
      takeLatest(getUserTimeReports, executeGetUserTimeReports),
      takeLatest(getUserGroupsTimeReports, executeGetUserGroupsTimeReports),
      takeLatest(getPrinterTimeReports, executeGetPrinterTimeReports),
      takeLatest(getPrinterGroupsTimeReports, executeGetPrinterGroupsTimeReports)
    ]);
  }

  return saga;
}

export default getSaga;
