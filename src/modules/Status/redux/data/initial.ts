import {IReduxState} from '../../namespace';

const initialState: IReduxState = {
  currentCharts: [],
  chartsData: {},
  replaced: {},
  showModal: false,
  modalMode: '',
  settings: null
};

export default initialState;
