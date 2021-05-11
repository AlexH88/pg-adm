import {IReduxState} from '../../namespace';

const initialState: IReduxState = {
  currentOperator: {},
  choosenCatalogEditName: '',
  showModal: false,
  showRemoveModal: false,
  modalMode: '',
  isMultiEdit: false,
  isAllSelected: false,
  selectedUsers: [],
  sendingCatalogData: false,
  showSyncModal: false,
  availableCatalogs: [],
  availableCatalogGroups: {},
  success: '',
  showModalLoadFile: false,
  error: '',
  usersOutsideDB: [],
  updateCardStatus: false,
};

export default initialState;
