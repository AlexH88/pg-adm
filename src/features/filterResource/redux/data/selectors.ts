import {createSelector} from 'reselect';
import {IReduxState} from 'shared/types/app';
import {Namespace as FilterResource} from 'features/filterResource';

const stateSelector = (state: IReduxState) => (
  state.filterResource
);

export const connectedHeadersSelector = (resource: string) => createSelector(
  stateSelector,
  (state: FilterResource.IReduxState) => {
    return state[resource] ? state[resource].headers.filter(header => header.isConnected) : [];
  },
);
