import {IReduxState} from '../../namespace';

const initialState: IReduxState = {
  chosenHostId: -1,
  showRemoveModal: false,
  showModal: false,
  showSyncModal: false,
  showHostGroupEditModal: false,
  tryDeletingItemId: '',
  deletingGroupId: '',
  deleteAgentId: -1,
  showLogModal: false,
  logPrinterId: {},
};

export default initialState;
