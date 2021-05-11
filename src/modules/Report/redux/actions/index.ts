import * as communications from './communication';
import {getSaga as saga} from './sagas';

const actions = {
  saga,
  ...communications,
};

export { actions };
