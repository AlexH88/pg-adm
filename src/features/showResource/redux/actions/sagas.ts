import {SagaIterator} from 'redux-saga';
import {push} from 'connected-react-router'
import {IConfigHeader, IExtraArguments, IReduxState} from 'shared/types/app';
import {all, call, delay, put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import * as NS from '../../namespace';
import {IResponse} from '../../namespace';
import getErrorMsg from 'shared/helpers/getErrorMessage';
import injectResource, {IInjectedResource} from 'shared/helpers/injectResource';
import convertFiltersShow from 'shared/helpers/convertFiltersShow';
import {
  changeLoader,
  clearTimerId,
  initHeadersConfigFinished,
  loadAggregateSuccess,
  loadBaseTemplate,
  loadPolicyRuleFailed,
  loadPolicyRuleSuccess,
  loadResource,
  loadResourceFailed,
  loadResourceSuccess,
  setCurrentOperator,
  setRoleResource,
  setShortResource,
  updateTableReloadPrompt
} from './communication';
import {getResource} from './selectors';
import {currentOperator as currentOperatorMock} from 'shared/api/mocks';
import {address} from 'shared/api/HttpActions';

let alertInProcessing: boolean = false;

function getSaga({ api }: IExtraArguments) {

  function* executeLoadResource({
    meta: { resource } = { resource: '' },
    payload: {
      cacheMode,
      byWebsocket,
    },
  }: NS.ILoadResource) {

    if (!byWebsocket) {
      yield put(injectResource(resource, changeLoader)(true));
    }

    try {
      yield call(executeLoadCurrentOperator);
      const state: IReduxState = yield select();
      const { sort, currentPage = 0 } = state.showResource[resource];
      const filterResource = state.filterResource[resource];
      const filterConfigs: any = filterResource ? filterResource.filterConfigs : [];

      let modifiedFilterConfigs: any = convertFiltersShow(filterConfigs);
      let search = '';
      if (resource === 'userlogs') {
        search = state.filterResource.searchString;
      }

      const pages = yield call(api.loadResource, resource, currentPage, sort, modifiedFilterConfigs, cacheMode, search);
      let baseTemplate = null
      if(resource == 'templates') {
        baseTemplate = yield call(api.loadBaseTemplate);
      }

/*
      const response: IResponse = {};

      if (resource === 'catalogs') {
        Object.keys(pages).forEach(i => {
          pages[i].items = pages[i].map((p: any) => ({
            ...p.settings,
            connection: p.connectionResult.success
          }));
        });
      }
*/

      const response: IResponse = {};

      if (resource === 'catalogs') {
        Object.keys(pages).forEach(i => {
          let temp = pages[i].items.map((p: any) => {
            return {
              ...p.settings,
              connection: p.connectionResult.success,
            }
          });
          pages[i].items = temp
        });
      }

      if (pages[currentPage]) {
        response[currentPage] = pages[currentPage].items;
      }
      if (pages[currentPage + 1]) {
        response[currentPage + 1] = pages[currentPage + 1].items;
      }
      if (pages[currentPage - 1]) {
        response[currentPage - 1] = pages[currentPage - 1].items;
      }

      if (resource === 'roles') {
        yield put(injectResource(resource, setRoleResource)(response));
      }

      yield put(injectResource(resource, loadResourceSuccess)(response));

      yield put(injectResource(resource, loadAggregateSuccess)(pages[currentPage].aggregate));
      yield put(injectResource(resource, loadBaseTemplate)(baseTemplate));
      yield put(injectResource(resource, updateTableReloadPrompt)());
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(injectResource(resource, loadResourceFailed)(message));
    }

    if (!byWebsocket) {
      yield put(injectResource(resource, changeLoader)(false));
    }
  }

  function* executeLoadShortResource({
    meta: { resource } = { resource: '' },
    payload: { id }
  }: NS.ILoadResource) {
    try {
      const response = yield call(api.loadShortResource, resource, id);

      yield put(injectResource(resource, setShortResource)(response));
    } catch (error) {
      console.log('Short resource fetching failed', error);
    }
  }

  function* executeRecursiveLoadResource({ meta: { resource } = { resource: '' } }: any): IterableIterator<any> {
    try {
      yield delay(10000);
      yield put(injectResource(resource, loadResource)(false, false));
    } finally {
      const resourceState: any = yield select((state: IReduxState) => getResource(state, resource ));
      if (resourceState && resourceState.pullingData) {
        yield* executeRecursiveLoadResource({ meta: { resource } });
      }
    }
  }
  /*
  function* executePageLoader({ meta: { resource } = { resource: '' } }: IInjectedResource) {
    yield call(executeLoadCurrentOperator);
    const state: IReduxState = yield select();
    const { data, sort, currentPage } = state.showResource[resource];
    const filterResource = state.filterResource[resource];
    const filterConfigs: any = filterResource ? filterResource.filterConfigs : [];

    let modifiedFilterConfigs: any = convertFiltersShow(filterConfigs);
    const isDataEmpty = !Object.keys(data).length;

    try {
      console.log('currentPage pre req', currentPage);
      const pages =  yield call(api.loadResource, resource, currentPage, sort, modifiedFilterConfigs, false);
      console.log('response', pages);
      console.log('currentPage', currentPage);

      const response: IResponse = {};
      if (pages[currentPage]) {
        response[currentPage] = pages[currentPage].items;
      }
      if (pages[currentPage + 1]) {
        response[currentPage + 1] = pages[currentPage + 1].items;
      }
      if (pages[currentPage - 1]) {
        response[currentPage - 1] = pages[currentPage - 1].items;
      }
      
      //const pages = {
      //  [currentPage]: response[currentPage].items,
      //  [currentPage + 1]: response[currentPage + 1].items,
      //};
      //if (currentPage - 1 >= 0) {
      //  pages[currentPage - 1] = response[currentPage - 1].items;
      //}

      yield put(injectResource(resource, loadResourceSuccess)(response));
      // To fix info about total_items
      // TODO: check if we need this after fixes from back ---> aggregate: {total_items}
      yield put(
        injectResource(resource, loadAggregateSucces)
          ({
            data: pages[currentPage].aggregate,
            pages: Math.floor(pages[currentPage].aggregate.total_items / 30),
          }),
      );
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(injectResource(resource, loadPageFailed)(message));
    }

    if (isDataEmpty) {
      yield put(injectResource(resource, changeLoader)(false));
      yield put(injectResource(resource, clearTimerId)());
    }
  }
  */

  function* executeResourceReload(action: IInjectedResource) {
    const { resource } = action.meta ? action.meta : { resource: '' };
    yield put(injectResource(resource, loadResource)(false, false));
  }

  function* executePolicyRuleLoad({ meta, payload }: NS.ILoadPolicyRule) {
    if (!meta) {
      throw Error('No meta!');
    }
    try {
      const response = yield call(api.loadPolicyRule, payload);
      yield put(injectResource(meta.resource, loadPolicyRuleSuccess)(response));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(injectResource(meta.resource, loadPolicyRuleFailed)({ error: message }));
    }
    yield put(injectResource(meta.resource, clearTimerId)());
    yield put(injectResource(meta.resource, changeLoader)(false));
  }

  function* executeInitConfigResource({ meta, payload }: NS.IInitHeadersTableConfig) {
    if (!meta) {
      throw Error('No meta');
    }
    const headers = payload.headers ? payload.headers : [];

    const storageSelectedHeaders = localStorage.getItem(`${meta.resource}Headers`);
    const selectedHeaders = storageSelectedHeaders ? JSON.parse(storageSelectedHeaders) : [] ;

    if (selectedHeaders && selectedHeaders.length > 0 ) {
      const newHeaders = headers.map((currentHeader: NS.IHeader) => {
        const isSelected = selectedHeaders.some((item: string) => currentHeader.value === item);
        return { ...currentHeader, isConnected: isSelected };
      });
      yield put(injectResource(meta.resource, initHeadersConfigFinished)({ headers: newHeaders }));
    } else {
      yield put(injectResource(meta.resource, initHeadersConfigFinished)({ headers }));
    }
  }

  function* executeChangeHeaders({ meta }: NS.IChangeHeader) {
    if (!meta) {
      throw Error('No meta');
    }
    const state: IReduxState = yield select();
    const headers = state.showResource[meta.resource].headers;
    const storageSelectedHeaders = headers
      .filter((header: IConfigHeader) => header.isConnected)
      .map((item: IConfigHeader) => item.value);
    localStorage.setItem(`${meta.resource}Headers`, JSON.stringify(storageSelectedHeaders));
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

  function* executeShowAlert({ payload }: any) {
    const { type, message } = payload;
    yield put({ type: 'SHOW_RESOURCE:SET_ALERT_DATA', payload: { type, message, isShowAlert: true } });
    alertInProcessing = true;
    yield new Promise((res) => setTimeout(res, 3000));
    if (!alertInProcessing) {
      return;
    }
    yield put({ type: 'SHOW_RESOURCE:SET_ALERT_DATA', payload: { type, message, isShowAlert: false } });
    alertInProcessing = false;
  }

  function* executeGetImages({ payload: { jobId, pages } }: any) {

    let imageIds = [];
    for (let i = 0; i < pages; i++) { imageIds.push(i + 1) }

    try {
      const gallery  = yield all(imageIds.map(id => call(api.loadImage, jobId, id)));

      const processed = gallery.map((res: any) => {
        const img = Buffer.from(res.data, 'binary').toString('base64');
        const urlChunks = res.config.url.replace(address, '').split('/');
        const id = urlChunks[urlChunks.length - 1];

        return ({
          id,
          status: res.status,
          img
        });
      });

      yield put({ type: 'SHOW_RESOURCE:SET_GALLERY', payload: { jobId, processed } });
    } catch (e) {
      const processed = imageIds.map(id => ({
        id,
//        status: e.request.status,
        status: e.status,
        img: null
      }))

      console.log('saga processed err', processed);
      yield put({ type: 'SHOW_RESOURCE:SET_GALLERY', payload: { jobId, processed } });
    }
  }

  function* saga(): SagaIterator {
    const recursiveLoadResource: NS.ILoadRecursiveResource   ['type'] = 'SHOW_RESOURCE:LOAD_RECURSIVE_RESOURCE';
    const loadResource: NS.ILoadResource                     ['type'] = 'SHOW_RESOURCE:LOAD_RESOURCE';
    const loadShortResource: NS.ILoadShortResource           ['type'] = 'SHOW_RESOURCE:LOAD_SHORT_RESOURCE';
    const resourceReload: NS.ISortResource                   ['type'] = 'SHOW_RESOURCE:SORT_RESOURCE';
    // const pageLoader: NS.IChangePage                         ['type'] = 'SHOW_RESOURCE:CHANGE_PAGE';
    const initHeadersTableConfig: NS.IInitHeadersTableConfig ['type'] = 'SHOW_RESOURCE:INIT_HEADERS_CONFIG';
    const changeHeader: NS.IChangeHeader                     ['type'] = 'SHOW_RESOURCE:CHANGE_HEADER';
    const loadPolicyRule: NS.ILoadPolicyRule                 ['type'] = 'SHOW_RESOURCE:LOAD_POLICY_RULE';
    const loadCurrentOperator: NS.ILoadCurrentOperator       ['type'] = 'SHOW_RESOURCE:LOAD_CURRENT_OPERATOR';
    const showAlert: NS.IShowAlert                           ['type'] = 'SHOW_RESOURCE:SET_ALERT_DATA';
    const getImages = 'SHOW_RESOURCE:GET_IMAGES';
    // const setCurrentOperator:     NS.ISetCurrentOperator     ['type'] = 'SHOW_RESOURCE:SET_CURRENT_OPERATOR';

    yield all([
      takeEvery(loadResource, executeLoadResource),
      takeEvery(loadShortResource, executeLoadShortResource),
      takeLatest(resourceReload, executeResourceReload),
      // takeLatest(pageLoader, executePageLoader),
      takeLatest(loadPolicyRule, executePolicyRuleLoad),
      takeLatest(initHeadersTableConfig, executeInitConfigResource),
      takeLatest(changeHeader, executeChangeHeaders),
      takeLatest(loadCurrentOperator, executeLoadCurrentOperator),
      takeLatest(showAlert, executeShowAlert),
      takeLatest(recursiveLoadResource, executeRecursiveLoadResource),
      takeLatest(getImages, executeGetImages)
      // takeLatest(setCurrentOperator, executeSetCurrentOperator),
    ]);
  }

  return saga;
}

export default getSaga;
