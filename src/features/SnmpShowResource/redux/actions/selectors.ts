import { IReduxState } from 'shared/types/app';
import { ISnmpResourceReduxState, IHeader } from '../../namespace';

function getResource(state: IReduxState, resource: string): ISnmpResourceReduxState {
  return state.SnmpShowResource[resource];
};

export {
  getResource,
}
