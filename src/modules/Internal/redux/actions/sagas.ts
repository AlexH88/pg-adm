import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {SagaIterator} from 'redux-saga';
import {getFormValues, initialize, startSubmit, stopSubmit} from 'redux-form';
import {getErrorMsg, getResourceById} from 'shared/helpers';
import {IExtraArguments, IReduxState, IResource} from 'shared/types/app';
import injectResource from 'shared/helpers/injectResource';
import * as showResourceFeature from 'features/showResource';
import * as actions from './communication';

function getSaga({ api }: IExtraArguments) {
  function* executeStartCreateEntry() {
    const formName = 'editSnmpConfigItem';

    try {
      let editedResource = {
        name: '',
      };
      yield put(initialize(formName, editedResource, true));
      yield put(actions.switchModalStatus(true, 'create'));
    } catch (error) {
      console.log('error', error);
    }
  }

  function* executeFinishCreateEntry({ meta: {resource}, payload: { renamedEntry } }: any) {
    const formName = 'editSnmpConfigItem';

    try {
      yield put(startSubmit(formName));

      const output: any = {};
      const { name } = yield select(getFormValues(formName));
      const state = yield select();
      const data = state.showResource.snmp_config.data[0];

      if (!renamedEntry) {
        const newData = [...data];
        newData.push({name, data: []});
        newData.forEach((c: any) => {
          output[c.name] = c.data;
        });
      } else {
        const newData = data.map((d: any) => {
          if (d.id === renamedEntry.id) {
            d.name = name;
          }
          return d;
        })
        newData.forEach((c: any) => {
          output[c.name] = c.data;
        });
      }

      const response = yield call(api.editResource, resource, output);

      if (response.status === 200) {
        yield put(actions.switchModalStatus(false, ''));
        yield put(stopSubmit(formName));
        yield put(injectResource(resource, showResourceFeature.actions.loadResource)(false, false));
      }
      yield;
    } catch (error) {
      console.log('error', error);
    }
  }

  function* executeStartEditEntry({ meta, payload }: any) {
    const resource = meta ? meta.resource : '';

    const formName = 'editSnmpConfigEntry';

    try {
      let editedResource: IResource = yield select((state: IReduxState) => getResourceById(resource, state, payload));
      //yield put(initialize(formName, editedResource, true));
      yield put(actions.switchModalStatus(true, 'edit'));
    } catch (error) {
      console.log('error', error);
    }
  }

  function* executeFinishEditEntry({ meta: {resource}, payload: { editedEntry, editedItem, shouldBeDeleted = false } }: any) {
    //yield put({type: 'SHOW_RESOURCE:TOGGLE_SPINNER', payload: true});
    const formName = 'editSnmpConfigEntry';

    try {
      yield put(startSubmit(formName));
      const state = yield select();
      const data = state.showResource.snmp_config.data[0];
      let updatedItem: any = {};
      if (shouldBeDeleted) {
        const updatedEntries = editedItem.data.filter((item: any, index: number) => index !== editedEntry);
        updatedItem = {...editedItem, data: updatedEntries};
      } else {
        const editedResource: IResource = yield select(getFormValues(formName));

        //const newData = data.filter((c: any) => c.id !== editedItem.id);

        const updatedEntries = editedItem.data.length === editedEntry ? [...editedItem.data, editedResource] : editedItem.data.map((item: any, index: number) => {
          if (index === editedEntry) {
            if(editedResource.oid == ""){
              editedResource.extraOid = ""
            }
            item = editedResource;
          }
          return item;
        });

        //updatedEntries.push(editedResource);
        updatedItem = {...editedItem, data: updatedEntries};
      }
      const newData = data.map((c: any) => {
        if (c.id === editedItem.id) {
          c = updatedItem;
        }
        return c;
      });

      const output: any = {};
      newData.forEach((c: any) => {
        output[c.name] = c.data;
      });

      const response = yield call(api.editResource, resource, output);

      if (response.status === 200) {
        //yield put(actions.switchModalStatus(false, ''));
        yield put(stopSubmit(formName));
        yield put(injectResource(resource, showResourceFeature.actions.loadResource)(false, false));
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(stopSubmit(formName, { _error: message }));
    }
    //yield put({type: 'INTERNAL_MODULE:SWITCH_MODAL_STATUS', payload: false });
    //yield put({type: 'SHOW_RESOURCE:TOGGLE_SPINNER', payload: false });
  }

  function* executeDeleteEntry({ meta: {resource} }: any) {
    try {
      const state = yield select();
      const configEntryForDeletion = state.internal.entryForDeletion;

      const data = state.showResource.snmp_config.data[0];
      const newData = data.filter((c: any) => c.id !== configEntryForDeletion);

      const output: any = {};
      newData.forEach((c: any) => {
        output[c.name] = c.data;
      });
      const response = yield call(api.editResource, resource, output);

      if (response.status === 200) {
        yield put(actions.switchRemoveModal());
        yield put(injectResource(resource, showResourceFeature.actions.loadResource)(false, false));
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  function* saga(): SagaIterator {
    const startEditEntry = 'INTERNAL_MODULE:START_EDIT_ENTRY';
    const finishEditEntry = 'INTERNAL_MODULE:FINISH_EDIT_ENTRY';
    const startCreateEntry = 'INTERNAL_MODULE:START_CREATE_ENTRY';
    const finishCreateEntry = 'INTERNAL_MODULE:FINISH_CREATE_ENTRY';
    const deleteEntry = 'INTERNAL_MODULE:DELETE_ENTRY';

    yield all([
      takeLatest(startEditEntry, executeStartEditEntry),
      takeLatest(finishEditEntry, executeFinishEditEntry),
      takeLatest(startCreateEntry, executeStartCreateEntry),
      takeLatest(finishCreateEntry, executeFinishCreateEntry),
      takeLatest(deleteEntry, executeDeleteEntry)
    ]);
  }

  return saga;
}

export default getSaga;
