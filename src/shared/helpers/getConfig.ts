import {ICofigAggregate, IReduxState} from 'shared/types/app';
import {ICalendar, IFilterConfig, IFilterConfigs} from 'features/filterResource/namespace';
import {Namespace as FilterResourceNamespace} from 'features/filterResource';

interface IAgregate {
  value: string;
  title: string;
}

function getHeadersConfig(resource: string, state: IReduxState) {
  const targetResource = state.configs.description[resource];

  const newHeaders = targetResource ?
    targetResource.params
    .map((param) => {
      const {
        view: title,
        name: value,
        sort: isSortable,
        use: isConnected,
        required
      } = param;

      return { title, value, isSortable, isConnected, required };
    })
    : [];

  return {
    headers: newHeaders
  };
}

function getFiltersConfig(resource: string, state: IReduxState) {
  return state.configs.description[resource].filters;
}

function getAggregates(resource: string, state: IReduxState) {
  const targetResource = state.configs.description[resource];

  const newAggregates = targetResource ?
    targetResource.aggregates
    .map((param: ICofigAggregate) => ({
      value: param.name,
      title: param.view,
    }))
    : [];

  return newAggregates;
}

function getNormalizeFilterConfigs(filterConfigs: FilterResourceNamespace.IFilterConfigs) {
  const filters: IFilterConfigs = {};
  for (const filterKey in filterConfigs) {
    if (getClass(filterConfigs[filterKey]) === 'Object' ) {
      const filter: any = filterConfigs[filterKey];
      if (filterIsCalendar(filter)) {
        for (const key in filter) {
          if (filter.hasOwnProperty(key)) {
            filters[`${filterKey}_${key}`] = filter[key];
          }
        }
      } else {
        filters[filterKey] = JSON.stringify(filter);
      }
    } else {
      filters[filterKey] = filterConfigs[filterKey];
    }
  }
  return filters;
}

function getClass(obj: IFilterConfig ) {
  return {}.toString.call(obj).slice(8, -1);
}

function filterIsCalendar(filter: IFilterConfig): filter is ICalendar {
  return typeof filter === 'object' && filter.hasOwnProperty('from') && filter.hasOwnProperty('to');
}

export {
  getHeadersConfig,
  getFiltersConfig,
  getAggregates,
  getNormalizeFilterConfigs
};
