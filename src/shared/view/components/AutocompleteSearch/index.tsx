import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';
import Monoselect from 'shared/view/elements/Monoselect/Monoselect';
import './style.styl';
import {IconButton} from 'shared/view/elements';
import CloseIcon from './closeIcon';

interface ISource {
  id: number;
  name: string;
  login: string;
  ip: string;
  driver: string;
  version: string;
}

interface IFilterState {
  currentQuery: string;
  mounted: boolean;
}

interface IOwnProps {
  label: string;
  value?: string;
  source?: ISource[];
  disabled?: boolean;
  required?: boolean;
  type?: string;
  param?: string;
  maxLength?: number;
  filterName: string;
  getOptions?: (value: string, filterName: string) => void;
  onChange?: (value: string) => void;
  acceptFilter: () => void;
  onRemove?(): void;
}

class AutocompleteSearch extends React.PureComponent<IOwnProps, IFilterState> {
  constructor(props: any) {
    super(props);

    this.state = {
      currentQuery: props.value || '',
      mounted: false
    };
  }

  private b = block('autocomplete-filter');

  public render() {
    const b = this.b;
    const {
      label,
      onRemove,
      filterName,
      source = []
    } = this.props;
    
    const processedSource: string[] = [];

    let newFilterName = 'name';

    if (['login', 'ip', 'driver', 'version', 'title'].includes(filterName)) {
      newFilterName = filterName;
    }

    if (source && source.length > 0) {
      source.forEach((s: any) => {
        processedSource.push(s[newFilterName]);
      });
    }

    return (
      <div className={b()}>
        <Monoselect
          label={label}
          onChange={this.onChange}
          onQueryChange={this.getOptions}
          source={processedSource}
          value={this.state.currentQuery}
        />
        {
          onRemove
            ? (
              <div className={b('button-rem')}>
                <IconButton
                  onClick={onRemove}
                  icon={<CloseIcon/>}
                />
              </div>
            )
            : null
        }
      </div>
    );
  }

  @bind
  private onChange(value: any) {
    const { onChange, acceptFilter } = this.props;
    if (onChange) {
      onChange(value);
    };
    this.setState({currentQuery: value});
    acceptFilter();
  }

  @bind
  private getOptions(searchString: string) {
    const { getOptions, filterName = '' } = this.props;
    this.setState({currentQuery: searchString});
    if (getOptions) { getOptions(searchString, filterName); }
  }
}

export default AutocompleteSearch;
