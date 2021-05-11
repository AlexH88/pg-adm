import {IReduxState, IResourceReduxState} from '../../namespace';

const initialResource: IResourceReduxState = {
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
  pages: 0,
  isLoading: false,
  timerId: null,
  pullingData: false,
  headers: [],
  showSpinner: false,
};

const initialState: IReduxState = {
  alertData: {
    isShowAlert: false,
    type: 'warning',
    message: null,
  } as any,
};

export { initialState, initialResource };
