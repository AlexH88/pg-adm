import * as React from 'react';
import {bind} from 'decko';
import {Dropdown} from 'shared/view/elements';
import Chip from 'react-toolbox/lib/chip';
import * as chip from './chip.styl';

interface ISource {
  label: string;
  value: string;
}

interface IFilterState {
  currentQuery: string;
  dropdownKey: number;
}

interface IOwnProps {
  label: string;
  value?: string;
  source?: ISource[];
  disabled?: boolean;
  required?: boolean;
  type?: string;
  maxLength?: number;
  onChange?: (event: React.FormEvent<HTMLFormElement> | string) => void;
  onRemove?(): void;
  onBlur?(event: React.FormEvent<HTMLFormElement> | string): void;
  error?: string;
  clear?: boolean;
}

class StatefulDropdown extends React.PureComponent<IOwnProps, IFilterState> {
  constructor(props: any) {
    super(props);
    const {value} = props;
    this.state = {
      currentQuery: value || '',
      dropdownKey: new Date().getTime()
    };
  }

  public componentWillReceiveProps(props: any) {
    this.setState({currentQuery: props.value});
  }

  public render() {
    const {
      label,
      source = [],
      error,
      onBlur,
      disabled,
      clear = false,
    } = this.props;

    return (
      <div>
        <Dropdown
          key={this.state.dropdownKey}
          label={label}
          source={source}
          onChange={this.onChange}
          onBlur={(e: any) => {
            if ( onBlur && (e.target.value === 'undefined' || !source.map(s => s.value).includes(e.target.value))) {
              onBlur('');
            } else {
              return null;
            }
          }}
          value={this.state.currentQuery}
          error={error}
          disabled = {disabled}
        />
        {
          clear ?
            <Chip
              theme={chip}
              deletable
              onDeleteClick={this.onClear}
            >
            </Chip> :
            null
        }

      </div>
    );
  }

  @bind
  private onClear() {
    const { onChange } = this.props;
    if (onChange) { 
      this.setState({
        currentQuery: '',
        dropdownKey: new Date().getTime()
      }, () => {onChange('none')});
    };
  }

  @bind
  private onChange(value: string) {
    const { onChange } = this.props;
    if (onChange) { 
      this.setState({
        currentQuery: value,
        dropdownKey: new Date().getTime()
      }, () => {onChange(value)});
    };
  }
}

export default StatefulDropdown;
