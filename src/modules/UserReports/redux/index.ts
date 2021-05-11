import actions from './actions';
import reducer from './reducers';

export function getResourceTypeByMetaResource(resource: string) {
  return ({
    user_timereports: 'users',
    user_groups_timereports: 'user_groups',
    printer_timereports: 'printers',
    printer_groups_timereports: 'printer_groups',
  } as any)[resource];
}

export function getPeriod(state: any, resource: string) {
  const valuesArray: any[] = state.filterResource && state.filterResource[resource].interval_filter;
  return valuesArray.filter((item: any) => item.isChecked)[0].name;
}

export function getAxis(state: any, resource: string) {
  const valuesArray: any[] = state.filterResource && state.filterResource[resource].type_filter;
  return valuesArray.filter((item: any) => item.isChecked)[0].name;
}

export { actions, reducer };
