import * as communicationActions from './communication';
import saga from './sagas';

const actions = {
  saga,
  ...communicationActions,
};

export default actions;
