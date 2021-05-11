import {IExtraArguments} from 'shared/types/app';
// import { IPolicy, IRule, IRuleGroup } from 'shared/types/policy';
// import { convertToRuleGroup } from 'shared/helpers/formatData';
import {all, call, put, select, take, takeLatest} from 'redux-saga/effects';
import {SagaIterator} from 'redux-saga';
// import {IReduxState} from "../../namespace/index";
import {getFormValues, initialize} from 'redux-form';
// import {getRuleById, getPrinterGroups, getUserGroups, getRuleData, getId} from './selectors';
//
// import getErrorMsg from 'shared/helpers/getErrorMessage';
// import injectResource from 'shared/helpers/injectResource';
import * as showResourceFeature from 'features/showResource';
import {snpmApi as thisApi} from '../../api';
import {actions} from 'modules/Snmp/redux';
import injectResource from 'shared/helpers/injectResource';
import {oidParameters} from 'modules/Snmp';

function getSaga({ api }: IExtraArguments) {

  const colors: string[] = ['black', 'yellow', 'magenta', 'cyan'];
  
  function withACapitalLetter(word: string): string {
    return word[0].toUpperCase() + word.slice(1);
  }

  function* executeSaveFirmware() {
    try {
      const formValues = yield select(getFormValues('edit_firmware'));
      console.log(formValues);
      const isEditMode = Boolean(formValues._id);
      const dataToSave: any = { id: formValues._id, parameters: {} as any };

      for (const key in formValues) {
        if (oidParameters.includes(key)) {
          dataToSave.parameters[key] = formValues[key];
        } else {
          dataToSave[key] = formValues[key];
        }
      }

      delete dataToSave._id;
      colors.forEach((color: string) => {
        delete dataToSave[`is${withACapitalLetter(color)}Toner`]
      });

      yield put(actions.switchEditModal());
      if (isEditMode) {
        yield call(thisApi.saveOidData, dataToSave);
      } else {
        yield call(thisApi.addOidData, dataToSave);
      }
      yield put(injectResource('oid', showResourceFeature.actions.loadResource)(false, false));
    } catch (e) {
      yield put({type: 'SHOW_RESOURCE:SHOW_ALERT', payload: { type: 'error', message: 'Ошибка сервера' }});
    }
  }

  function* startEditFirmware({ payload }: any) {
    try {
      const initializeValues: any = { ...payload, ...payload.parameters }; // TODO type
      delete initializeValues.parameters;
      colors.forEach((color: string) => {
        if (initializeValues[`${color}_toner_current`] || initializeValues[`${color}_toner_percent`]
                                                                            || initializeValues[`${color}_toner_max`]) {
          initializeValues[`is${withACapitalLetter(color)}Toner`] = true;
        }
      });
      console.log(initializeValues);
      yield put(initialize('edit_firmware', initializeValues, true));
      yield put(actions.switchEditModal());
    } catch (e) {

    }
  }

  function* startDelteFirmware({ payload }: any) {
    try {
      yield put(actions.switchRemoveModal());
      yield take('SNMP_MODULE:ACCEPT_DELETE_FIRMWARE');
      yield put(actions.switchRemoveModal());
      yield call(thisApi.removeOid, payload._id);
      yield put(injectResource('oid', showResourceFeature.actions.loadResource)(false, false));
    } catch (e) {
      yield put({type: 'SHOW_RESOURCE:SHOW_ALERT', payload: { type: 'error', message: 'Ошибка сервера' }});
    }
  }

  function* saga(): SagaIterator {
    const editFirmware:         any         = 'SNMP_MODULE:START_EDIT_FIRMWARE';
    const removeFirmware:         any         = 'SNMP_MODULE:START_REMOVE_FIRMWARE';
    const saveFirmware:         any         = 'SNMP_MODULE:SAVE_FIRMWARE';

    yield all([
      takeLatest(editFirmware, startEditFirmware),
      takeLatest(removeFirmware, startDelteFirmware),
      takeLatest(saveFirmware, executeSaveFirmware)
    ]);
  }

  return saga;
}

export default getSaga;
