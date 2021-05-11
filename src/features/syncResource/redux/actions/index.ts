import * as communicationAction from './communication';
import saga from './sagas';

const actions = {
  saga,
  ...communicationAction,
};

export default actions;
