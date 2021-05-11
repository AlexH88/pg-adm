import {IReduxState} from '../../namespace';

const initialState: IReduxState = {
  modalMode: '',
  choosenPrintServerEditName: '',
  showRemoveModal: false,
  showModal: false,
  showSyncModal: false,
  showHostGroupEditModal: false,
  tryDeletingItemId: '',
  deletingGroupId: '',
  deleteAgentId: -1,
  showLogModal: false,
  logPrinterId: {},
  printerGroups: null
};

export default initialState;
