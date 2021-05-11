import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import * as monoselect from './Monoselect.styl';

export interface ISource {
  [source: string]: string;
}

interface IOwnProps {
  label: string;
  source: string[];
  theme?: any;
  value: string;
  onChange?: (value: any) => void;
  onQueryChange?: (value: string) => void;
  disabled?: boolean;
  handleKeyDown?: (e: any) => void;
}

class Monoselect extends React.Component<IOwnProps, {}> {
  private b = block('monoselect');

  public render() {
    const b = this.b;
    const {
      onChange,
      label,
      value,
      source= {},
      theme,
      disabled,
      handleKeyDown
    } = this.props;

    return (
      <div className={b('wrapper')}>
        <Autocomplete
          disabled={disabled}
          selectedPosition="none"
          theme={theme ? theme : monoselect}
          direction="down"
          onChange={onChange}
          onQueryChange={this.onQueryChange}
          label={label}
          source={source}
          value={value}
          showSuggestionsWhenValueIsSet
          suggestionMatch="anywhere"
          multiple={false}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  }

  @bind
  private onQueryChange(value: any) {
    const { onChange } = this.props;
    const { onQueryChange } = this.props;
    if (onQueryChange) { onQueryChange(value); }
    onChange(value)
  }
}

export default Monoselect;
