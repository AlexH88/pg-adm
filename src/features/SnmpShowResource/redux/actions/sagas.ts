import { SagaIterator } from 'redux-saga';
import { push } from 'connected-react-router'
import { IExtraArguments } from 'shared/types/app';
import { put, select, call, takeLatest, takeEvery, delay, all } from 'redux-saga/effects';
import * as NS from '../../namespace';
import { ISnmpReduxState } from '../../namespace';
import getErrorMsg from 'shared/helpers/getErrorMessage';
import injectResource from 'shared/helpers/injectResource';
import convertFiltersShow from 'shared/helpers/convertFiltersShow';
import { SnmpChangeLoader, loadSnmpResourceSuccess, loadResourceFailed, setCurrentOperator, SnmpLoadResource, printerSizeRate } from './communication';

import { currentOperator as currentOperatorMock } from 'shared/api/mocks';

function getSaga({ api }: IExtraArguments) {

  function* executeSnmpLoadResource({
    meta: { resource } = { resource: '' },
    payload: {
      cacheMode,
      byWebsocket,
    },
  }: NS.ISnmpLoadResource) {

    if (!byWebsocket) {
      yield put(injectResource(resource, SnmpChangeLoader)(true));
    }
      const state: ISnmpReduxState = yield select();
      const { sort, currentPage, pictureId } = state.SnmpShowResource['floors'];
      const filterResource = state.filterResource[resource];
      const filterConfigs: any = filterResource ? filterResource.filterConfigs : [];
      let modifiedFilterConfigs: any = convertFiltersShow(filterConfigs);
      const pages = yield call(api.loadResource, resource, currentPage, sort, modifiedFilterConfigs, cacheMode);
      const response = pages[0];
      const addPrinters = yield call(api.loadAddPrinters);
    try {
      yield call(executeLoadCurrentOperator);
      yield put(injectResource(resource, loadSnmpResourceSuccess)(response, addPrinters));
      let storageSize = localStorage.getItem('printerSize')
      storageSize === null ? null : yield put(injectResource(resource, printerSizeRate)(localStorage.getItem('printerSize')));
      let storage = localStorage.getItem('storageCurrentFloor')
      let id = storage === null ? pages[0].floorNumbers[0] : localStorage.getItem('storageCurrentFloor')
      if(id == undefined) {
        let img = '';
        let printersArray = [];
        let id = ''
        yield put({ type: 'SNMP_SHOW_RESOURCE:SET_PICTURE', payload: {img, resource, id, printersArray, addPrinters} })
        localStorage.setItem("storageCurrentFloor", id);
      }
      const responsePicture = yield call(api.loadSnmpPicture, resource, id)
      const img = responsePicture.floorPicture
      const printersArray = responsePicture.floorPrinters
      // const img = Buffer.from(responsePicture, 'binary').toString('base64');
      yield put({ type: 'SNMP_SHOW_RESOURCE:SET_PICTURE', payload: {img, resource, id, printersArray, addPrinters} })
      localStorage.setItem("storageCurrentFloor", id);
      yield put(injectResource(resource, loadSnmpResourceSuccess)(response, addPrinters));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(injectResource(resource, loadResourceFailed)(message));
    }

    if (!byWebsocket) {
      yield put(injectResource(resource, SnmpChangeLoader)(false));
    }
  }

  function* executeSnmpLoadPicture({
    meta: { resource } = { resource: '' },
    payload: { id }
  }: NS.ISnmpLoadResource) {
    try {
      yield put({ type: 'SHOW_RESOURCE:PUT_CURRENT_PAGE_ID', payload: id });
      yield put(injectResource(resource, SnmpChangeLoader)(true));
      const responsePicture = yield call(api.loadSnmpPicture, resource, id);
      const img = responsePicture.floorPicture
      const printersArray = responsePicture.floorPrinters
      const addPrinters = yield call(api.loadAddPrinters);
      const state: ISnmpReduxState = yield select();
      const { currentPageId } = state.SnmpShowResource['floors'];
      if(currentPageId === responsePicture.floorNumber || currentPageId === null ){
        yield put({ type: 'SNMP_SHOW_RESOURCE:SET_PICTURE', payload: {img, resource, id, printersArray, addPrinters} });
        localStorage.setItem("storageCurrentFloor", id);
        yield put(injectResource(resource, SnmpChangeLoader)(false))
      }
    } catch (error) {
      console.log('Short resource fetching failed', error);
    } 
  }

  function* executeAddPrinterToFloor({
    meta: { resource } = { resource: '' },
    payload: { idPrinter, floorNumber }
  }: NS.IAddPrinterToFloor) {
    try {
      const addPrinterToFloor = yield call(api.addPrinterToFloar, idPrinter, floorNumber);
      const id = floorNumber
      const responsePicture = yield call(api.loadSnmpPicture, resource, floorNumber);
      const img = responsePicture.floorPicture
      const printersArray = responsePicture.floorPrinters
      const addPrinters = yield call(api.loadAddPrinters);
      yield put({ type: 'SNMP_SHOW_RESOURCE:SET_PICTURE', payload: {img, resource, id, printersArray, addPrinters} })
      localStorage.setItem("storageCurrentFloor", id);
    } catch (error) {
      console.log('Short resource fetching failed', error);
    }
  }

  function* executeAddCoordinatesPrinterToFloor({
    meta: { resource } = { resource: '' },
    payload: { idPrinter, floorNumber, x, y }
  }: NS.IAddCoordinatesPrinterToFloor) {
    try {
      const addPrinterToFloor = yield call(api.addСoordinatesPrinterToFloar, idPrinter, floorNumber, x, y);
      const id = floorNumber
      const responsePicture = yield call(api.loadSnmpPicture, resource, floorNumber);
      const img = responsePicture.floorPicture
      const printersArray = responsePicture.floorPrinters
      const addPrinters = yield call(api.loadAddPrinters);
      yield put({ type: 'SNMP_SHOW_RESOURCE:SET_PICTURE', payload: {img, resource, id, printersArray, addPrinters} })
      localStorage.setItem("storageCurrentFloor", id);
    } catch (error) {
      console.log('Short resource fetching failed', error);
    }
  }

  function* executedeletePrinter({
    meta: { resource } = { resource: '' },
    payload: { idPrinter, floorNumber }
  }: NS.IdeletePrinter) {
    try {
      yield call(api.deletePrinter, idPrinter);
      const id = floorNumber
      const responsePicture = yield call(api.loadSnmpPicture, resource, floorNumber);
      const img = responsePicture.floorPicture
      const printersArray = responsePicture.floorPrinters
      const addPrinters = yield call(api.loadAddPrinters);
      yield put({ type: 'SNMP_SHOW_RESOURCE:SET_PICTURE', payload: {img, resource, id, printersArray, addPrinters} })
      localStorage.setItem("storageCurrentFloor", id);
    } catch (error) {
      console.log('Short resource fetching failed', error);
    }
  }

  function* executeDeleteFloor({
    meta: { resource } = { resource: '' },
    payload: { floorNumber }
  }: NS.IdeleteFloor) {
    try {
      yield call(api.deleteFloor, floorNumber);
      const state: ISnmpReduxState = yield select();
      const { sort, currentPage } = state.SnmpShowResource['floors'];
      const filterResource = state.filterResource[resource];
      const filterConfigs: any = filterResource ? filterResource.filterConfigs : [];
      let modifiedFilterConfigs: any = convertFiltersShow(filterConfigs);
      const pages = yield call(api.loadResource, resource, currentPage, sort, modifiedFilterConfigs, false);
      let response = null;
      let id = null;
      let pageNumber = null;
      if(pages[floorNumber] == undefined) {
        response = pages[0];
        id = pages[0].floorNumbers[0];
        pageNumber = pages[0].floorNumbers[0]
      } else {
        response = pages[floorNumber];
        id = pages[floorNumber].floorNumbers[0];
        pageNumber = pages[floorNumber].floorNumbers[0];
      }

      const addPrinters = yield call(api.loadAddPrinters);
      yield call(executeLoadCurrentOperator);
      yield put(injectResource(resource, loadSnmpResourceSuccess)(response, addPrinters));
      if(id == undefined) {
        let img = '';
        let printersArray = [];
        let id = ''
        yield put({ type: 'SNMP_SHOW_RESOURCE:SET_PICTURE', payload: {img, resource, id, printersArray, addPrinters} })
        localStorage.setItem("storageCurrentFloor", id);
      }
      const responsePicture = yield call(api.loadSnmpPicture, resource, id)
      const img = responsePicture.floorPicture
      const printersArray = responsePicture.floorPrinters
      localStorage.setItem("storageCurrentFloor", pageNumber);
      const pageses = yield call(api.loadResource, resource, currentPage, sort, modifiedFilterConfigs, false);
      let responses = null;
      if(pageses[floorNumber] == undefined) {
        responses = pageses[0];
      } else {
        responses = pageses[floorNumber];
      }
      yield put(injectResource(resource, loadSnmpResourceSuccess)(responses, addPrinters));
      yield put({ type: 'SNMP_SHOW_RESOURCE:SET_PICTURE', payload: {img, resource, id, printersArray, addPrinters} })
    } catch (error) {
      console.log('Short resource fetching failed', error);
    }
  }
  

  function* executeLoadCurrentOperator() {
    try {
      // const response = yield call(api.loadCurrentOperator); // FIXME remove comment for request current operator from server
      const response = currentOperatorMock;
      yield put(setCurrentOperator(response));
      yield put({ type: 'SETTINGS_MODULE:SET_FEATURES_DATA', payload: response.features });
    } catch (error) {
      yield put(push('/app/login'));
      
    }
  }

    function* executePrinterSizeRate({payload: rate }: NS.IPrinterSizeRate) {
      console.log("saga", rate)

      localStorage.setItem('printerSize', rate)

      try {
      } catch (error) {
        
      }
    }

  function* saga(): SagaIterator {
    const snmpLoadPicture: NS.ISnmpLoadPicture               ['type'] = 'SNMP_SHOW_RESOURCE:LOAD_PICTURE';
    const deletePrinter: NS.IdeletePrinter                   ['type'] = 'SNMP_SHOW_RESOURCE:DELITE_PRINTER';
    const deleteFloor: NS.IdeleteFloor                       ['type'] = 'SNMP_SHOW_RESOURCE:DELITE_FLOOR';
    const addPrinterToFloor: NS.IAddPrinterToFloor           ['type'] = 'SNMP_SHOW_RESOURCE:ADD_PRINTER_TO_FLOOR';
    const addCoordinatesPrinterToFloor: NS.IAddCoordinatesPrinterToFloor ['type'] = 'SNMP_SHOW_RESOURCE:ADD_COORDINATES_PRINTER_TO_FLOOR';
    const SnmpLoadResource: NS.ISnmpLoadResource             ['type'] = 'SNMP_SHOW_RESOURCE:LOAD_RESOURCE';
    const loadCurrentOperator: NS.ILoadCurrentOperator       ['type'] = 'SHOW_RESOURCE:LOAD_CURRENT_OPERATOR';
    const printerSizeRate: NS.IPrinterSizeRate               ['type'] = 'SNMP_SHOW_RESOURCE:PRINTER_SIZE_RATE';
    

    yield all([
      takeEvery(snmpLoadPicture, executeSnmpLoadPicture),
      takeEvery(deletePrinter, executedeletePrinter),
      takeEvery(deleteFloor, executeDeleteFloor),
      takeEvery(addPrinterToFloor, executeAddPrinterToFloor),
      takeEvery(addCoordinatesPrinterToFloor, executeAddCoordinatesPrinterToFloor),
      takeEvery(SnmpLoadResource, executeSnmpLoadResource),
      takeLatest(loadCurrentOperator, executeLoadCurrentOperator),
      takeLatest(printerSizeRate, executePrinterSizeRate)
    ]);
  }

  return saga;
}

export default getSaga;
