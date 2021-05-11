import {fromJS, Map} from 'immutable';
import {IReduxState, SyncResourceActions} from '../../namespace';
import {initialState} from '../data/initial';

function mainReducer(state: IReduxState = initialState, action: SyncResourceActions): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);
  switch (action.type) {

  case 'SYNC_RESOURCE:SWITCH_SYNC_ITEMS_MODAL':
    const showSyncModal = imState.get('showSyncingItemsModal');
    return imState.set('showSyncingItemsModal', !showSyncModal).toJS();

  case 'SYNC_RESOURCE:LOAD_SYNC_DATA_SUCCESS': {
    const data : any = action.payload;
    if(!data) return state; // TODO

    //const unsync = data.unsync.filter((group: string) => !action.payload.sync.includes(group));
    //action.payload.unsync = unsync;
    return imState.set('data', action.payload).toJS();
  }

  interface ISyncPrinters {
    sync: string[];
    unsync: string[];
  }

  case 'SYNC_RESOURCE:SET_SYNC_ITEMS' : {
    const data: ISyncPrinters = action.payload;
    return imState.set('data', data).toJS();
  }

  case 'SYNC_RESOURCE:DRAW_PROGRESSBAR' : {
    const printerName: string = action.payload;
    // const showPB = imState.get('showPB');
    const showPB = state.showPB;
    showPB[printerName] = true;
    return imState.set('showPB', showPB).toJS();
  }


  case 'SYNC_RESOURCE:CLEAR_ALL_PROGRESSBAR' : {
    return imState.set('showPB', {}).toJS();
  }

  case 'SYNC_RESOURCE:HIDE_PROGRESSBAR' : {
    const printerName: string = action.payload;
    // const showPB = imState.get('showPB');
    const showPB = state.showPB;
    showPB[printerName] = false;
    // delete showPB[printerName];
    return imState.set('showPB', showPB).toJS();
  }

  case 'SYNC_RESOURCE:PROGRESSBAR_LOADED_TRUE' : {
    const printerName: string = action.payload;
    const PBLoaded = state.PBLoaded;
    PBLoaded[printerName] = true;
    return imState.set('PBLoaded', PBLoaded).toJS();
  }

  case 'SYNC_RESOURCE:PRINTER_SYNC_ERROR' : {
    const printerName: string = action.payload;
    const syncError = state.syncError;
    syncError[printerName] = true;
    return imState.set('syncError', syncError).toJS();
  }

  case 'PRINTERS_MODULE:SWITCH_SYNC_MODAL': {
    return imState.set('syncError', {}).toJS();
  }

  case 'SYNC_RESOURCE:PRINTER_SYNC_ERROR_HIDE' : {
    const printerName: string = action.payload;
    const syncError = state.syncError;
    syncError[printerName] = false;
    return imState.set('syncError', syncError).toJS();
  }

  case 'SYNC_RESOURCE:SELECT_ITEM_RESOURCE': {
    const { id, data, value, type } = action.payload;
    let modifiedArray = '';
    if (type === 'sync') {
      modifiedArray = 'selectedSyncItems';
    }
    if (type === 'unsync') {
      modifiedArray = 'selectedAsyncItems';
    }
    const selectedItems = imState.get(modifiedArray).toJS() || [];
    let modifyItems;
    if (value) {
      modifyItems = [...selectedItems];
      modifyItems.push(data);
    } else {
      modifyItems = [...selectedItems].filter((item: any) => item.id !== id);
    }
    return imState.set(modifiedArray, modifyItems).toJS();
  }

  case 'SYNC_RESOURCE:SELECT_ALL_ITEM_RESOURCE': {
    const { type, data, selectedItems } = action.payload;
    let modifiedArray = '';
    if (type === 'sync') {
      modifiedArray = 'selectedSyncItems';
    }
    if (type === 'unsync') {
      modifiedArray = 'selectedAsyncItems';
    }
    if (selectedItems.length === data.length) {
      return imState.set(modifiedArray, []).toJS();
    } else {
      return imState.set(modifiedArray, data).toJS();
    }
  }

  case 'SYNC_RESOURCE:TRY_SYNC_ITEMS_SUCCESS':
    return imState
      .set('syncingItems', action.payload)
      .set('syncingAction', 'sync')
      .toJS();

  case 'SYNC_RESOURCE:TRY_ASYNC_ITEMS_SUCCESS':
    return imState
      .set('syncingItems', action.payload)
      .set('syncingAction', 'unsync')
      .toJS();

    case 'SYNC_RESOURCE:SYNC_MODAL_ERROR' :
      return imState
        .set('syncDataModalError', action.payload)
        .toJS();

  default:
    return state;
  }
}

export default mainReducer;
