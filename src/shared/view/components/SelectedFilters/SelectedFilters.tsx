import * as React from 'react';
import {block} from 'bem-cn';
import {AutocompleteFilter, SelectFilter, ValueFilter} from 'shared/view/components';
import Calendar from 'shared/view/components/Calendar/Calendar';
import MultiFilter from 'shared/view/components/MultiFilter/MultiFilter';
import './SelectedFilters.styl';
import {FilterType} from 'features/filterResource/namespace';
import debounce from 'shared/helpers/debounce';

interface IValues {
  id: number;
  name: string;
}

interface IHeader {
  name: string;
  type: FilterType;
  isConnected: boolean;
  values?: IValues[];
  title: string;
}

interface IProps {
  resource?: string;
  headers: IHeader[];
  value: any;
  filterOptions?: any;
  acceptFilter: () => void;
  getOptions?: (searchString: string, filterName: string) => void;
  onChooseFilter: (value: string, isCheck: boolean) => void;
  onChangeFilter: (name: string, value: string) => void;
}

class SelectedFilters extends React.Component<IProps, {}> {

  private b = block('selected-filters');

  public render() {
    const b = this.b;
    const { headers } = this.props;

    return (
      <div className={b()}>
        {
          headers
            .filter(header => header.isConnected)
            .map(({title, name, type, values}) => (
              this.getFilterByType(type, name, title, values)
            ))
        }
      </div>
    );
  }

  private getOptions = debounce((searchString: string, filterName: string) => {
    const {getOptions} = this.props;
    if (getOptions && searchString.length >= 2) {
      getOptions(searchString, filterName);
    }
  }, 1000);

  private getFilterByType(type: FilterType, name: string, title: string, presetOptions: any) {
    const b = this.b;
    let {
      onChangeFilter,
      onChooseFilter,
      acceptFilter,
      value,
      filterOptions,
      resource = ''
    } = this.props;
  
    const lsData: any = localStorage.getItem(`${resource}Filters`);
    const filtersFromLS: any[] = JSON.parse(lsData) || [];

    const filtersToObj: any = {};
    filtersFromLS.forEach((filter: any) => {
      filtersToObj[filter.name] = filter.value;
    });

    let filterOptionsSubgroup;

    if (!presetOptions) {
      if (Object.keys(filterOptions).length > 0){
        filterOptionsSubgroup = filterOptions[name];
      }
    }

    switch (type) {
    case 'autocompleteFilter':
      return (
        <div key={name} className={b('autocomplete-filter')}>
          <AutocompleteFilter
            onChange={onChangeFilter.bind(this, name)}
            value={value[name]}
            source={filterOptionsSubgroup}
            getOptions={this.getOptions}
            filterName={name}
            label={title}
            acceptFilter={acceptFilter}
            onRemove={onChooseFilter.bind(this, name, false)}
          />
        </div>
      );
    case 'valueFilter':
      return (
        <div key={name} className={b('value-filter')}>
          <ValueFilter
            value={value[name] || filtersToObj[name]}
            label={title}
            onChange={onChangeFilter.bind(this, name)}
            onAcceptFilter={acceptFilter}
            onRemoveFilter={onChooseFilter.bind(this, name, false)}
          />
        </div>
      );
    case 'calendar':
      return (
        <div key={name} className={b('calendar')}>
          <Calendar
            value={value[name]}
            label={title}
            onChange={onChangeFilter.bind(this, name)}
            acceptFilter={acceptFilter}
            onRemove={onChooseFilter.bind(this, name, false)}
          />
        </div>
      );
    case 'multiFilter':
      return (
        <div key={name} className={b('multi-filter')}>
          <MultiFilter
            onChange={onChangeFilter.bind(this, name)}
            value={value[name]}
            source={filterOptionsSubgroup}
            getOptions={this.getOptions}
            filterName={name}
            label={title}
            acceptFilter={acceptFilter}
            onRemove={onChooseFilter.bind(this, name, false)}
          />
        </div>
      );
    case 'selectFilter':
      return (
        <div key={name} className={b('select-filter')}>
          <SelectFilter
            onChange={onChangeFilter.bind(this, name)}
            value={value[name]}
            source={presetOptions}
            label={title}
            acceptFilter={acceptFilter}
            onRemove={onChooseFilter.bind(this, name, false)}
          />
        </div>
      );
    default: return undefined;
    }
  }
}

export default SelectedFilters;
