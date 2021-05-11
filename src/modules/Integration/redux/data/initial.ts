import {IReduxState} from '../../namespace';

const initialState: IReduxState = {
  showModal: false,
  modalMode: '',
  success: '',
  currentStatus: {},
  settingsIntegration: {},
  sendingCatalogData: false,
  showSyncModal: false,
  showRemoveModal: false,
  availableCatalogs: [],
  availableCatalogGroups: {},
};

export default initialState;
