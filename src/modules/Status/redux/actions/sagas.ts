import * as NS from '../../namespace';
import {IExtraArguments} from 'shared/types/app';
import {all, call, put, takeLatest, select} from 'redux-saga/effects';
import {SagaIterator} from 'redux-saga';
import thisApi from '../../api';

function getSaga({ api }: IExtraArguments) {

  if (api) {};

  function* executeGetChartsData(action: any) {
    const state = yield select();
    let eD = new Date().toISOString();
    let sD = new Date(Math.abs(new Date() as any) - 86400 * 1000 * 30).toISOString();

    let settingsChart = {
      startDate: sD,
      endDate: eD,
      period: 'DAY'
    }

    if(state.status.settings){
      if(!state.status.settings.fuulTime){
        settingsChart.startDate = new Date(state.status.settings.startDate).toISOString();
        settingsChart.endDate = new Date(state.status.settings.endDate).toISOString();
      } else {
        settingsChart.startDate = '';
        settingsChart.endDate = '';
      }
      settingsChart.period = state.status.settings.period;
    }

    try {
      let respTopUsers = yield call(thisApi.getTopUsers, settingsChart);
      let respTopGroupsUsers = yield call(thisApi.getTopGroupsUsers, settingsChart);
      let respTopGroups = yield call(thisApi.getTopPrintedGroups, settingsChart);
      let respTopPrinters = yield call(thisApi.getTopPrinters, settingsChart);
      let respPrintedPages = yield call(thisApi.getPrintedPages, settingsChart);
      let respPrintedGroupsPages = yield call(thisApi.getPrintedGroupsPages, settingsChart);

      yield put({
        type: 'STATUS_MODULE:SET_CHART_DATA',
        payload: {
          chartName: 'top_users',
          data: respTopUsers,
        },
      });
      yield put({
        type: 'STATUS_MODULE:SET_CHART_DATA',
        payload: {
          chartName: 'top_groups_users',
          data: respTopGroupsUsers,
        },
      });

      yield put({
        type: 'STATUS_MODULE:SET_CHART_DATA',
        payload: {
          chartName: 'top_groups',
          data: respTopGroups,
        },
      });
      yield put({
        type: 'STATUS_MODULE:SET_CHART_DATA',
        payload: {
          chartName: 'top_printers',
          data: respTopPrinters,
        },
      });
      yield put({
        type: 'STATUS_MODULE:SET_CHART_DATA',
        payload: {
          chartName: 'printed_pages',
          data: respPrintedPages,
        },
      });
      yield put({
        type: 'STATUS_MODULE:SET_CHART_DATA',
        payload: {
          chartName: 'printed_groups_pages',
          data: respPrintedGroupsPages,
        },
      });
    } catch (error) {
      console.log('SAGA ERROR', error);
    }
  }

  function* executeGetDynamicGrow(action: any) {
    let respGetDynamicGrow = yield call(thisApi.getDynamicGrow, action.payload.interval);
    yield put({
      type: 'STATUS_MODULE:SET_CHART_DATA',
      payload: {
        chartName: 'dynamic_grow',
        data: respGetDynamicGrow,
      },
    });
  }

  function* saga(): SagaIterator {
    const getChartsData:         NS.IGetChartsData['type']         = 'STATUS_MODULE:GET_CHARTS_DATA';
    const getPrintedPages:       NS.IGetPrintedPages['type']       = 'STATUS_MODULE:GET_PRINTED_PAGES';
    const getDynamicGrow:        NS.IGetDynamicGrow['type']        = 'STATUS_MODULE:GET_DYNAMIC_GROW';
    
    yield all([
      takeLatest(getChartsData, executeGetChartsData),
      takeLatest(getDynamicGrow, executeGetDynamicGrow)
    ]);
  }

  return saga;
}

export default getSaga;
