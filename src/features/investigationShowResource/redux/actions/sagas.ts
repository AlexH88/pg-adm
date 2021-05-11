import {SagaIterator} from 'redux-saga';
import {push} from 'connected-react-router'
import {IConfigHeader, IExtraArguments, IReduxState} from 'shared/types/app';
import {all, call, delay, put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import * as NS from '../../namespace';
import {IResponse} from '../../namespace';
import {switchModalStatus} from './communication';
import getErrorMsg from 'shared/helpers/getErrorMessage';
import injectResource, {IInjectedResource} from 'shared/helpers/injectResource';
import convertFiltersShow from 'shared/helpers/convertFiltersShow';
import {address} from 'shared/api/HttpActions';

let alertInProcessing: boolean = false;

function getSaga({ api }: IExtraArguments) {
  function* executeGetHashData({ meta, payload }: NS.IGetHashData & IInjectedResource) {
    try {
      const response = yield call(api.getHashData, payload);
//      console.log('response', response)
//      yield put(injectResource(meta.resource, loadPolicyRuleSuccess)(response));
      yield put({ type: 'SHOW_INVESTIGATION_RESOURCE:GET_HASH_DATA_SUCCESS', payload: response });
      yield put(switchModalStatus({ status: true, mode: '' }));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'SHOW_INVESTIGATION_RESOURCE:GET_HASH_DATA_ERROR', payload: message });
      yield put(switchModalStatus({ status: true, mode: '' }));
      console.log('Error', message)
    }

  }

  function* saga(): SagaIterator {
    const getHashData: NS.IGetHashData  ['type'] = 'SHOW_INVESTIGATION_RESOURCE:GET_HASH_DATA';

    yield all([
      takeLatest(getHashData, executeGetHashData),
    ]);
  }

  return saga;
}

export default getSaga;
