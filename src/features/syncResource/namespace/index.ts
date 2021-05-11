
interface IReduxState {
  data: ISyncData;
  selectedSyncItems: string[];
  selectedAsyncItems: string[];
  syncingItems: ISyncingItems;
  showSyncingItemsModal: boolean;
  syncingAction: 'sync' | 'unsync' | '';
  syncDataModalError: boolean,
  showPB: any;
  PBLoaded: any;
  syncError: any;
  chosenHostId: number;
}

interface ISyncData {
  sync: string[];
  unsync: string[];
}

interface ISyncingItems {
  err_code: string;
  users: string[];
}

interface IPayloadSelectItemAction {
  name: string;
  type: string;
  value: boolean;
}

interface IFailedResponse {
  error: string;
}

interface ISyncTableTitles {
  [ key: string ]: string;
  sync: string;
  unsync: string;
}

type TypesSyncingActions = 'sync' | 'unsync' | '';

export {
  IReduxState,
  ISyncData,
  ISyncingItems,
  IPayloadSelectItemAction,
  IFailedResponse,
  TypesSyncingActions,
  ISyncTableTitles,
}

export * from './actionTypes';
