import * as NS from '../../namespace';
import {getFormValues, startSubmit, stopSubmit} from 'redux-form';
import {push} from 'connected-react-router'

import {IExtraArguments} from 'shared/types/app';
import {all, call, put, select, takeLatest, take} from 'redux-saga/effects';
import {SagaIterator} from 'redux-saga';
import { getErrorMsg } from 'shared/helpers';
import { switchModalStatus } from './communication';

function getSaga({ api }: IExtraArguments) {

  function* executeLoadAuthorities(): any {
    try {
      const response = yield call(api.getAuthoritiesCurrent)

      yield put({ type: 'LOGIN_MODULE:GET_AUTHORITIES_CURRENT', payload: response.data});
      localStorage.setItem("authoritiesCurrent", JSON.stringify(response.data));
    } catch (error) {
      console.log('ERROR!'); // TODO Поправить
    }
  }

  function* executeAuthorize(action: any) {
    try {
      const formName = 'logIn';
      yield put(startSubmit(formName));
      const loginData: any = yield select(getFormValues(formName));
      const { username, password } = loginData;

      if (!username && !password) {
        throw new Error('modules.guest.thunks.notEmptyLoginPassword');
      }

      const response: any = yield call(api.getTokens, username, password);

      yield put({ type: 'LOGIN_MODULE:SET_ERROR_DATA', payload: false});

      if (response.status === 200) {
        yield put(stopSubmit(formName));
        localStorage.setItem('userCredentials', JSON.stringify(response.data));
        yield put(push(action.payload));
        let res: any = yield call(api.getCurrentUser);
        if(res){
          localStorage.setItem('currentUser', res.username)
        }
      }
    } catch (error) {
      yield put({ type: 'LOGIN_MODULE:SET_ERROR_DATA', payload: true});
    }
  }

  function* executeLogout()  {
    try {
      yield call(api.logout);
    } catch (error) {
      throw new Error('Logout failed!');
    } finally {
      localStorage.setItem(
        'userCredentials',
        JSON.stringify({ access_token: '', refresh_token: '' }),
      );
      localStorage.removeItem('authoritiesCurrent');
      //dispatch(setCurrentRole('guest'));
      yield put(push('/login'));
    }
  }

  function* executeChangePassword(  )  {
    try {
      const { oldPassword, newPassword, repeatNewPassword } = yield select(getFormValues('сhangePassword'));
      yield call(api.сhangePassword, oldPassword, newPassword, repeatNewPassword);
      yield put(switchModalStatus(false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(stopSubmit('сhangePassword', { _error: message }));
      yield yield put({
        type: 'SHOW_RESOURCE:SHOW_ALERT',
        payload: {
          type: 'error',
          message: message,
        },
      });
    } 
  }

  function* saga(): SagaIterator {
    const authorize:        NS.IAuthorize['type'] = 'LOGIN_MODULE:AUTHORIZE';
    const loadAuthorities:  NS.IILoadAuthorities['type'] = 'LOGIN_MODULE:LOAD_AUTHORITIES';
    const logout:           NS.ILogout['type']    = 'LOGIN_MODULE:LOGOUT';
    const changePassword:   NS.IChangePassword['type']    = 'LOGIN_MODULE:CHANGE_PASSWORD';

    yield all([
      takeLatest(authorize, executeAuthorize),
      takeLatest(loadAuthorities, executeLoadAuthorities),
      takeLatest(logout, executeLogout),
      takeLatest(changePassword, executeChangePassword)
    ]);
  }

  return saga;
}

export default getSaga;
