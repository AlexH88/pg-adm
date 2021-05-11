import * as communications from './communication';
import saga from './sagas';

const actions = {
  saga,
  ...communications,
};

export default actions;
