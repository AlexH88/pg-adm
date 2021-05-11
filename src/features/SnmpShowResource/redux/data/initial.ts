import { ISnmpReduxState, ISnmpResourceReduxState } from '../../namespace';
      

const initialResource: ISnmpResourceReduxState = {
  currentOperator: {},
  data: [],
  prompt: [],
  short: {},
  gallery: {},
  sort: {},
  aggregate: {
    total_items: 0,
  },
  currentPage: 0,
  pages: [],
  isLoading: true,
  timerId: null,
  pullingData: false,
  headers: [],
  showSpinner: false,
  picture: '',
  pictureId: null,
  printerSize: '1x',
  currentPageId: null,
  totalFloor: 0,
  totalPrinter: 0,
  printers: [],
  addPrinters: [],
  errorFloors: []
};

const initialState: ISnmpReduxState = {
  alertData: {
    isShowAlert: false,
    type: 'warning',
    message: null,
  } as any,
};

export { initialState, initialResource };
