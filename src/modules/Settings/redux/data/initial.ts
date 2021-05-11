import {IReduxState} from '../../namespace';

const initialState: IReduxState = {
  showSaveModal: false,
  showRemoveModal: false,
  showAlertModal: false,
  showModal: false,
  deletingRole: null,
  ruleDescription: [],
  modalMode: '',
  featuresData: {},
  isLoading: false,
  deletingPrinter: null,
  currentVersion: null,
  availableVersions: [],
  showUpdateDialog: false,
  showBlockDialog: false,
  showLicenseDialog: false,
  licenseData: {},
  authorities: [],
  error: '',
  editModalId: null
};

export default initialState;
