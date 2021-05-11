import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';
import Multiselect from 'shared/view/elements/Multiselect/Multiselect';
import Chip from 'react-toolbox/lib/chip';
import './style.styl';
import * as chip from './chip.styl';
import {IconButton} from 'shared/view/elements';
import CloseIcon from './closeIcon';

interface ISource {
  id: number;
  name: string;
}

interface IOwnProps {
  label: string;
  value?: string[];
  source?: ISource[];
  disabled?: boolean;
  required?: boolean;
  type?: string;
  param?: string;
  maxLength?: number;
  filterName: string;
  getOptions?: (value: string, filterName: string) => void;
  onChange?: (value: string[]) => void;
  acceptFilter: () => void;
  onRemove?(): void;
}

class MultiFilter extends React.PureComponent<IOwnProps, {}> {

  private b = block('multi-filter');

  public render() {
    const b = this.b;
    const {
      label,
      onRemove,
      value = [], 
      source = [],
      filterName
    } = this.props;

    const processedSource: string[] = [];

    let newFilterName = 'name';

    if (['mac'].includes(filterName)) {
      newFilterName = filterName;
    }

    if (source && source.length > 0) {
      source.forEach((s: any) => {
        processedSource.push(s[newFilterName]);
      });
    }

    let valueChip = value.filter(item => {
      return item !== ''
    })

    return (
      <div className={b()}>
        <div className={b('subwrapper')}>
          <Multiselect
            label={label}
            onChange={this.onChange}
            onQueryChange={this.getOptions}
            source={processedSource}
            value={value!}
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
        <div className={b('chip')}>
          {
            value && value.length
              ? value.map((item) => (
                (
                  <div key={item} className={b('chip-item')}>
                    <Chip
                      theme={chip}
                      deletable
                      onDeleteClick={this.deleteMultiFilterValue.bind(this, item)}
                    >
                      {item}
                    </Chip>
                  </div>
                )
              ))
              : null
          }
        </div>
      </div>
    );
  }

  @bind
  private onChange(newVal: any) {
    const { onChange, acceptFilter, source, value = [] } = this.props;
    let newList: any;
    if (onChange && source) {
      newList= new Set([...value, ...newVal]);
      onChange(Array.from(newList));
    };
    acceptFilter();
  }

  @bind
  private deleteMultiFilterValue(id: string) {
    const { onChange, acceptFilter, value = [] } = this.props;
    
    value.splice(value.indexOf(id), 1);
    if (onChange) { onChange(value); };
    acceptFilter();
  }

  @bind
  private getOptions(searchString: string) {
    const { getOptions, filterName = '' } = this.props;
    if (getOptions) { getOptions(searchString, filterName); }
  }
}

export default MultiFilter;
