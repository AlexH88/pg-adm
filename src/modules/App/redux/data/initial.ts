import {IReduxState} from '../../namespace';

const initialState: IReduxState = {
  description: {
    users: {
      params: [],
      permissions: [],
      filters: [],
      aggregates: [],
    },
  },
  status: false,
};

export default initialState;
