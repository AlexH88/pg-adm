import {Namespace as FilterNamespace} from 'features/filterResource';

function formatType(data: FilterNamespace.IResourceReduxState, name: string): string {
  if (Object.keys(data.filterConfigs).length) {
    const valueField = data.filterConfigs.type;
    const filter = data.filters.find(item => item.name === name);
    if (filter && filter.values) {
      const field = filter.values.find(value => value.name === valueField);
      return field && field.label ? field.label : '';
    }
  }
  return '';
}

function formatGroup(data: FilterNamespace.IResourceReduxState, name: string): string {
  const valueField = data.filterConfigs[name] as string[];
  if (valueField && Object.keys(data.filterConfigs).length) {
    const filter = data.filters.find(item => item.name === name);
    if (filter && filter.values) {
      const values = filter.values.filter(value => valueField.includes(value.id.toString()));
      const valuesList = values.map(value => value.name);
      return valuesList && valuesList.length ? valuesList.join(',') : 'Все';
    }
  }
  return 'Все';
}

export {
  formatType,
  formatGroup,
}
