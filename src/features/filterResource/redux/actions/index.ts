import * as communicationActions from './communication';
import {getSaga as saga} from './sagas';

const actions = {
  saga,
  ...communicationActions,
};

export { actions };
