import {IReduxState} from '../../namespace';

const initialState: IReduxState = {
  hostGroups: [],
  showRemoveModal: false,
  showCreateEditModal: false,
  showWatermarksSettingsModal: false,
  showDecryptModal: false,
  showAddModal: false,
  showSaveModal: false,
  showMarkModal: false,
  isPolicyEdit: false,
  showConfirmModal: false,
  choosenPolicyEdit: null,
  choosenMarkPolicyEdit: null,
  userGroups: [],
  printerGroups: [],
  textLabelsData: [],
  decryptMessage: '',
  modalMode: '',
  addWaterMark: {
    type: '',
    text: '',
    status: false
  },
};

export { initialState }
