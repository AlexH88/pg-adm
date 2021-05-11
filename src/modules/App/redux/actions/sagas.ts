import {all, call, put, takeLatest} from 'redux-saga/effects';
import {SagaIterator} from 'redux-saga';
import {getErrorMsg} from 'shared/helpers';
import {IExtraArguments} from 'shared/types/app';
import * as actionTypes from '../../actionTypes';
import {changeConfigStatus, loadConfigSuccess} from './communication';

// import {IReduxState} from "../../namespace";

function getSaga({ api }: IExtraArguments) {

  function* executeloadConfig() {
    try {
      const response: any = yield call(api.loadConfigDescription);

      yield put(loadConfigSuccess(response));
      yield put(changeConfigStatus(Boolean(response)));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'USERS-MODULE:CREATE_RESOURCE_FAILED', payload: message });
    }
  }

  // function* executeSendLoginData()  {
  //   const state: IReduxState = yield select();
  //   if (!1) console.log(state);
  //   // if (!1) console.log(payload);
  //   try {
  //     const data = yield call(api.sendLoginData);
  //     // if (!1) console.log(meta);
  //     if (!1) console.log(data);
  //     yield put({ type: 'LOGIN_MODULE:SET_SERVER_DATA', payload: data.data});
  //   } catch (error) {
  //     if (!1) console.log('executeSendLoginData error!' )
  //   }
  // }

  function* saga(): SagaIterator {
    // const sendLoginData:         actionTypes.ISendUserData['type'] = 'APPLICATION-MODULE:SEND_USER_DATA';
    const loadConfig: actionTypes.ILoadConfigAction['type'] = 'APPLICATION-MODULE:CREATE_RESOURCE';

    yield all([
      takeLatest(loadConfig, executeloadConfig),
    // takeLatest(sendLoginData, executeSendLoginData)
    ]);
  }

  return saga;
}

export default getSaga;
