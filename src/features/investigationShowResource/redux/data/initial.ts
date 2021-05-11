import {IReduxState, IResourceReduxState} from '../../namespace';

const initialResource: IResourceReduxState = {
  data: []
};

const initialState: IReduxState = {
  data: [],
  showModal: false,
  result: null,
};

export { initialResource, initialState };
