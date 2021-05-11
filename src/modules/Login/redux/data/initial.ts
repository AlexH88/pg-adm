import {IReduxState} from '../../namespace';

const initialState: IReduxState = {
  loginError: false,
  login: {},
  serverResponse: {},
  showRemoveModal: false,
  showCreateEditModal: false,
  showAddModal: false,
  showSaveModal: false,
  isPolicyEdit: false,
  showConfirmModal: false,
  choosenPolicyEdit: null,
  userGroups: [],
  printerGroups: [],
  authoritiesCurrent: [],
  showModal: false
};

export { initialState }
