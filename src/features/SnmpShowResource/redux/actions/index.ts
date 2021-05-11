import * as communicationActions from './communication';
import * as selectors from './selectors';
import saga from './sagas';

const actions = {
  saga,
  ...communicationActions,
};

export { selectors, actions }
export default actions;
