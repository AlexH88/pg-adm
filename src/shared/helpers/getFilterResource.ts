import {IReduxState} from 'shared/types/app';

function getFilters(resource: string, state: IReduxState) {
  const allFilters: any =   state.filterResource[resource];
  return allFilters;
}

export {
  getFilters,
};
