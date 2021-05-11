import {IReduxState} from 'shared/types/app';
import {IHeader, IResourceReduxState} from '../../namespace';

function getResource(state: IReduxState, resource: string): IResourceReduxState {
  return state.showResource[resource];
};

function getHeaders(state: IReduxState, resource: string): IHeader[] {
  return Object.keys(state.showResource).length && state.showResource[resource]
    ? state.showResource[resource].headers
    : [];
}

export {
  getResource,
  getHeaders,
}
