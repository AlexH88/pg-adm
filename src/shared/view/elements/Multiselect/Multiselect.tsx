import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import * as multiselect from './Multiselect.styl';

interface ISource {
  [value: string]: string;
}

interface IOwnProps {
  label: string;
  source: string[] | ISource;
  theme?: any;
  value: string[];
  onChange?: (value: string[]) => void;
  onQueryChange?: (value: string) => void;
  disabled?: boolean;
}

class Multiselect extends React.Component<IOwnProps, {}> {

  private b = block('multiselect');

  public render() {
    const b = this.b;
    const {
      onChange,
      label,
      value,
      source= {},
      theme,
      disabled
    } = this.props;

    return (
      <div className={b('wrapper')}>
        <Autocomplete
          disabled={disabled}
          selectedPosition="none"
          theme={theme ? theme : multiselect}
          direction="down"
          onChange={onChange}
          onQueryChange={this.onQueryChange}
          label={label}
          source={source}
          value={value}
        />
      </div>
    );
  }

  @bind
  private onQueryChange(value: any) {
    const { onQueryChange } = this.props;
    if (onQueryChange) { onQueryChange(value); }
  }
}

export default Multiselect;
