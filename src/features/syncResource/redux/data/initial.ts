import {IReduxState} from '../../namespace';

const initialState: IReduxState = {
  data: {
    sync: [],
    unsync: []
  },
  selectedSyncItems: [],
  selectedAsyncItems: [],
  syncingItems: { err_code: '', users: [] },
  showSyncingItemsModal: false,
  chosenHostId: -1,
  syncingAction: '',
  syncDataModalError: false,
  showPB: {},
  PBLoaded: {},
  syncError: {},
};

export { initialState };
